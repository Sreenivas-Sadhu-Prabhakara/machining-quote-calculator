/* Machining quote calculator — per-piece pricing for job shops. No deps, no network. */
(function () {
  "use strict";

  var FMT = {
    INR: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }),
    PHP: new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })
  };
  var SYM = { INR: "₹", PHP: "₱" };
  var cur = "INR";

  function money(x) {
    if (!isFinite(x)) x = 0;
    return FMT[cur].format(x);
  }

  var ids = ["material", "rate", "cycle", "setup", "qty", "scrap", "overhead", "margin"];
  var el = {};
  for (var i = 0; i < ids.length; i++) {
    el[ids[i]] = document.getElementById(ids[i]);
  }

  // Empty -> 0; never NaN/Infinity; negatives clamped to 0.
  function num(node) {
    if (!node) return 0;
    var v = parseFloat(node.value);
    if (!isFinite(v)) return 0;
    return v < 0 ? 0 : v;
  }

  var out = {
    material: document.getElementById("r-material"),
    machine: document.getElementById("r-machine"),
    setup: document.getElementById("r-setup"),
    overhead: document.getElementById("r-overhead"),
    scrap: document.getElementById("r-scrap"),
    margin: document.getElementById("r-margin"),
    price: document.getElementById("r-price"),
    lot: document.getElementById("r-lot"),
    lotLabel: document.getElementById("r-lot-label"),
    main: document.getElementById("price-main"),
    sub: document.getElementById("price-sub")
  };

  function compute() {
    var material = num(el.material);
    var rate = num(el.rate);
    var cycle = num(el.cycle);
    var setup = num(el.setup);
    var qty = num(el.qty);
    var scrapIn = num(el.scrap);
    var overhead = num(el.overhead);
    var margin = num(el.margin);

    var scrap = scrapIn >= 100 ? 99.9 : scrapIn; // keep (1 - scrap%) divisor finite
    var qtyDiv = Math.max(qty, 1); // amortise setup; guard divide-by-zero

    var machineCost = rate * (cycle / 60);
    var setupCost = rate * (setup / 60) / qtyDiv;
    var worksCost = material + machineCost + setupCost;
    var overheadAmt = worksCost * overhead / 100;
    var factoryCost = worksCost + overheadAmt;
    var costAfterScrap = factoryCost / (1 - scrap / 100);
    var scrapUplift = costAfterScrap - factoryCost;
    var pricePP = costAfterScrap * (1 + margin / 100);
    var marginAmt = pricePP - costAfterScrap;
    var lotTotal = pricePP * qty;

    out.material.textContent = money(material);
    out.machine.textContent = money(machineCost);
    out.setup.textContent = money(setupCost);
    out.overhead.textContent = money(overheadAmt);
    out.scrap.textContent = money(scrapUplift);
    out.margin.textContent = money(marginAmt);
    out.price.textContent = money(pricePP);
    out.lot.textContent = money(lotTotal);

    var qtyShow = Math.round(qty * 1000) / 1000; // tidy fractional display
    out.lotLabel.textContent = "Lot total (" + qtyShow + ")";
    out.main.textContent = money(pricePP);
    out.sub.textContent = "× " + qtyShow + " pieces = " + money(lotTotal) + " total";
  }

  // Currency toggle: update pressed state, input prefixes, and recompute.
  var curBtns = document.querySelectorAll("[data-cur]");
  var symSpans = document.querySelectorAll(".cursym");

  function setCur(next) {
    if (!FMT[next]) return;
    cur = next;
    for (var j = 0; j < curBtns.length; j++) {
      var on = curBtns[j].getAttribute("data-cur") === cur;
      curBtns[j].setAttribute("aria-pressed", on ? "true" : "false");
    }
    for (var k = 0; k < symSpans.length; k++) {
      symSpans[k].textContent = SYM[cur];
    }
    compute();
  }

  for (var b = 0; b < curBtns.length; b++) {
    curBtns[b].addEventListener("click", (function (node) {
      return function () { setCur(node.getAttribute("data-cur")); };
    })(curBtns[b]));
  }

  // Recompute on every input event.
  for (var m = 0; m < ids.length; m++) {
    if (el[ids[m]]) el[ids[m]].addEventListener("input", compute);
  }

  var printBtn = document.getElementById("print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  // Reset: clear inputs, keep currency, recompute.
  var resetBtn = document.getElementById("reset");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    for (var n = 0; n < ids.length; n++) {
      if (el[ids[n]]) el[ids[n]].value = "";
    }
    compute();
  });

  compute();
})();
