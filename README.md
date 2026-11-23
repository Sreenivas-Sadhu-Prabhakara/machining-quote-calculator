# Machining quote calculator for job shops

A free, single-page calculator that turns **material, machine time and setup** into a
defensible **per-piece price** — with a transparent, printable breakdown you can hand to
a customer as a quote. Part of the **Open MSME** family of free tools for micro and small
businesses in **India and the Philippines**.

## What it does

Enter the numbers you already know for a part — material cost per piece, machine rate per
hour, cycle time, one-time setup time, order quantity, and your scrap, overhead and margin
percentages — and the tool prices the part the way a job shop builds a cost sheet:

1. **Machine time** = machine rate × cycle minutes ÷ 60
2. **Setup** = machine rate × setup minutes ÷ 60, amortised across the quantity
3. **Works cost** = material + machine time + setup
4. **Factory cost** = works cost + overhead %
5. **Scrap uplift** grosses the cost up: factory cost ÷ (1 − scrap %), so good pieces cover rejects
6. **Price per piece** = scrap-adjusted cost + margin % (margin on cost)
7. **Lot total** = price per piece × quantity

The result panel shows the big per-piece price plus a line-by-line breakdown — Material,
Machine time, Setup, Overhead, Scrap uplift, Margin — that adds up to the price. Switch
between **₹ INR** and **₱ PHP**, and print or save the quote as a PDF.

## Who it's for

Machine shops, fabricators and other small manufacturers who quote one-off and batch jobs
and want a fast, consistent, transparent per-piece price instead of a gut-feel number.

## Standard / method

There is no single statutory rate here — every cost and percentage is your own input. The
tool follows the **conventional job-shop cost build-up** used in manufacturing estimating
and cost accounting: works cost → factory cost (overhead) → scrap-adjusted cost → margin →
price. Setup is treated as a one-time cost amortised over the lot, and scrap is handled as
an uplift so that accepted pieces carry the cost of rejected ones.

## How to run

It's a static page — no build step, no dependencies, no network calls. Serve the folder
and open it in a browser:

```sh
python3 -m http.server 8137
```

Then visit <http://localhost:8137/>. You can also open `index.html` directly.

## A note on scope and accuracy

This is an **estimate to speed up quoting**, not a costing system of record. It assumes a
single all-in machine rate and even amortisation of setup across the lot; it does not model
multiple operations, tooling amortisation, inspection, freight, or quantity price breaks,
and it does not convert between currencies. Confirm your rates, tolerances and overhead
recovery for your own shop before committing to a price.

MIT licensed.
