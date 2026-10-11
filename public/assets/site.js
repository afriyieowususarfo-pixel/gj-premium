/**
 * GJ Premium — site behaviour.
 *
 * Everything here replaces what the old React app did at runtime: highlighting
 * the current nav item, revealing sections as they scroll into view, and
 * validating + submitting the quote form. No framework, no dependencies.
 */
(function () {
  "use strict";

  // ── Quote form destination ──────────────────────────────────────────
  //
  // Paste a form-service endpoint here (any HTTPS endpoint that accepts a
  // JSON POST with CORS, e.g. "https://formspree.io/f/xxxxxxxx") and every
  // request is delivered to the mailbox as a structured submission.
  //
  // Left empty, the form falls back to opening the visitor's own mail client
  // with the request pre-filled and addressed to QUOTE_EMAIL, so the site
  // still works out of the box with nothing to configure.
  var FORM_ENDPOINT = "";
  var QUOTE_EMAIL = "gjpremium14@gmail.com";

  var SUBMIT_FAILED =
    "We couldn't send your request. Please try again, or email " +
    QUOTE_EMAIL +
    ".";

  // ── Highlight the nav item for the current page / section ───────────

  function markActiveNav() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    var hash = window.location.hash;

    var links = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var to = link.getAttribute("data-to").replace(/\/+$/, "") || "/";
      var linkHash = link.getAttribute("data-hash") || "";

      var active = linkHash
        ? path === to && hash === linkHash
        : path === to;

      link.classList.toggle("text-foreground", active);
      link.classList.toggle("text-muted-foreground", !active);
    }
  }

  // ── Reveal sections as they scroll into view ────────────────────────

  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      for (var i = 0; i < targets.length; i++) {
        targets[i].classList.add("is-visible");
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: 0 },
    );

    for (var j = 0; j < targets.length; j++) observer.observe(targets[j]);
  }

  // ── Native <select> placeholders ────────────────────────────────────

  function syncSelectPlaceholders() {
    var selects = document.querySelectorAll("select");
    for (var i = 0; i < selects.length; i++) {
      selects[i].setAttribute("data-empty", selects[i].value ? "false" : "true");
    }
  }

  // ── Quote form ──────────────────────────────────────────────────────

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    var errors = {};
    if (values.fullName.trim().length < 2)
      errors.fullName = "Enter your full name.";
    if (!EMAIL_PATTERN.test(values.email.trim()))
      errors.email = "Enter a valid work email.";
    if (!values.organization.trim())
      errors.organization = "Enter your organization or facility name.";
    if (!values.facilityType) errors.facilityType = "Select your facility type.";
    if (!values.category) errors.category = "Select a category.";
    if (!values.items.trim())
      errors.items = "Tell us which items and quantities you need.";
    if (!values.neededBy) errors.neededBy = "Select when you need delivery.";
    if (!values.location.trim()) errors.location = "Where should we deliver?";
    return errors;
  }

  function showError(id, message) {
    var control = document.getElementById(id);
    var slot = document.querySelector('[data-error-for="' + id + '"]');
    if (control) control.setAttribute("aria-invalid", message ? "true" : "false");
    if (!slot) return;
    slot.textContent = message || "";
    slot.hidden = !message;
  }

  function collect(form) {
    var values = {};
    var fields = ["fullName", "email", "phone", "organization", "facilityType", "category", "items", "neededBy", "location", "notes"];
    fields.forEach(function (name) {
      var control = form.elements[name];
      values[name] = control ? String(control.value || "") : "";
    });
    return values;
  }

  function requestSummary(values) {
    return [
      "New quote request for GJ Premium",
      "",
      "Name:            " + values.fullName.trim(),
      "Organization:    " + values.organization.trim(),
      "Facility type:   " + values.facilityType,
      "Category:        " + values.category,
      "Work email:      " + values.email.trim(),
      "Phone:           " + (values.phone.trim() || "-"),
      "",
      "Items & quantities:",
      values.items.trim(),
      "",
      "Needed by:       " + values.neededBy,
      "Delivery:        " + values.location.trim(),
      "Notes:           " + (values.notes.trim() || "-"),
    ].join("\n");
  }

  function setBusy(form, busy) {
    var button = form.querySelector("[data-submit]");
    var idle = form.querySelector("[data-submit-idle]");
    var spinning = form.querySelector("[data-submit-busy]");
    if (button) button.disabled = busy;
    if (idle) idle.classList.toggle("hidden", busy);
    if (spinning) spinning.classList.toggle("hidden", !busy);
  }

  function setSubmitError(form, message) {
    var box = form.querySelector("[data-submit-error]");
    if (!box) return;
    box.textContent = message || "";
    box.hidden = !message;
  }

  function goToThankYou(reference) {
    var url = "/thank-you/";
    if (reference) url += "?ref=" + encodeURIComponent(reference);
    window.location.assign(url);
  }

  function initQuoteForm() {
    var form = document.querySelector("[data-quote-form]");
    if (!form) return;

    // Arriving from a category link (/quote/?category=Wound%20care) preselects it.
    var requested = new URLSearchParams(window.location.search).get("category");
    if (requested && form.elements.category) {
      for (var i = 0; i < form.elements.category.options.length; i++) {
        if (form.elements.category.options[i].value === requested) {
          form.elements.category.value = requested;
          break;
        }
      }
    }
    syncSelectPlaceholders();

    form.addEventListener("change", function (event) {
      if (event.target && event.target.tagName === "SELECT") {
        syncSelectPlaceholders();
        showError(event.target.id, "");
      }
    });

    form.addEventListener("input", function (event) {
      if (event.target && event.target.id) showError(event.target.id, "");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var values = collect(form);
      var errors = validate(values);

      var firstInvalid = null;
      ["fullName", "email", "organization", "facilityType", "category", "items", "neededBy", "location"].forEach(
        function (id) {
          showError(id, errors[id] || "");
          if (errors[id] && !firstInvalid) firstInvalid = id;
        },
      );

      if (firstInvalid) {
        var target = document.getElementById(firstInvalid);
        if (target && target.scrollIntoView) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (target && target.focus) target.focus({ preventScroll: true });
        return;
      }

      setSubmitError(form, "");
      setBusy(form, true);

      if (!FORM_ENDPOINT) {
        // No form service configured: hand the request to the visitor's mail
        // client, pre-filled and addressed to the quote mailbox.
        var subject =
          "Quote request — " +
          values.organization.trim() +
          " (" +
          values.category +
          ")";
        var mailto =
          "mailto:" +
          QUOTE_EMAIL +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(requestSummary(values));
        window.location.href = mailto;
        window.setTimeout(function () {
          setBusy(form, false);
          goToThankYou("");
        }, 300);
        return;
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          organization: values.organization.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          facilityType: values.facilityType,
          category: values.category,
          items: values.items.trim(),
          neededBy: values.neededBy,
          location: values.location.trim(),
          notes: values.notes.trim(),
          summary: requestSummary(values),
        }),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json().catch(function () {
            return {};
          });
        })
        .then(function (data) {
          goToThankYou(data && data.reference ? String(data.reference) : "");
        })
        .catch(function () {
          setBusy(form, false);
          setSubmitError(form, SUBMIT_FAILED);
        });
    });
  }

  // ── Thank-you reference ─────────────────────────────────────────────

  function initReference() {
    var slot = document.querySelector("[data-reference]");
    if (!slot) return;
    var reference = new URLSearchParams(window.location.search).get("ref");
    if (reference && reference.trim()) slot.textContent = reference.trim();
  }

  // ── Boot ────────────────────────────────────────────────────────────

  markActiveNav();
  initReveal();
  initQuoteForm();
  initReference();
  window.addEventListener("hashchange", markActiveNav);
})();
