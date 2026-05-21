import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FlagTriangleRight,
  Gauge,
  ShieldAlert,
  TimerReset,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const quoteRows = [
  {
    item: "316L transfer pump kit",
    required: "24 ea",
    alloyWorks: "$4,180 · 28 days · MOQ 24",
    northline: "$4,365 · 18 days · MOQ 12",
    deltaForge: "$4,120 · 35 days · MOQ 24",
    decision: "Northline",
    risk: "Lead-time risk avoided",
    tone: "positive",
  },
  {
    item: "Mechanical seal replacement set",
    required: "48 ea",
    alloyWorks: "$188 · 14 days · MOQ 24",
    northline: "$194 · 12 days · MOQ 48",
    deltaForge: "$176 · 16 days · MOQ 60",
    decision: "AlloyWorks",
    risk: "MOQ exposure",
    tone: "warning",
  },
  {
    item: "VFD panel",
    required: "12 ea",
    alloyWorks: "$1,480 · 21 days · MOQ 12",
    northline: "$1,510 · 20 days · MOQ 12",
    deltaForge: "Price omitted · 19 days · MOQ 12",
    decision: "Clarify quote",
    risk: "Missing commercial data",
    tone: "review",
  },
  {
    item: "Tri-clamp fitting pack",
    required: "96 ea",
    alloyWorks: "$42 · 10 days · MOQ 100",
    northline: "$46 · 9 days · MOQ 96",
    deltaForge: "$39 · 15 days · MOQ 120",
    decision: "Northline",
    risk: "MOQ + excess inventory",
    tone: "warning",
  },
] as const;

const workflowBefore = [
  "Three quote PDFs arrive in different formats.",
  "Analyst rekeys unit price, lead time, and payment terms into Excel.",
  "Missing fields surface late, after recommendation work has started.",
  "The lowest price can masquerade as the best award decision.",
];

const workflowAfter = [
  "Quotes normalize into one line-item structure.",
  "Lead-time, MOQ, and missing-data exceptions surface immediately.",
  "Analyst compares award paths instead of rebuilding the dataset.",
  "Recommendation memo is ready with traceable trade-offs.",
];

const cycleSteps = [
  { label: "Collect + normalize", before: "1.5 days", after: "0.5 day" },
  { label: "Compare suppliers", before: "1.0 day", after: "0.4 day" },
  { label: "Clarify risks", before: "1.5 days", after: "1.0 day" },
  { label: "Prepare award memo", before: "1.0 day", after: "1.0 day" },
] as const;

const decisionNotes = [
  {
    title: "Award against the constraint, not just the unit price",
    body: "Northline is not cheapest on the pump kit, but it protects the plant-start date with an 18-day lead time and keeps the award aligned to the operating constraint.",
  },
  {
    title: "Treat MOQ as working-capital risk",
    body: "DeltaForge wins raw seal-kit price, yet its MOQ forces 12 excess sets into inventory. AlloyWorks preserves the buying signal with less cash tied up.",
  },
  {
    title: "Hold ambiguous lines before they become bad POs",
    body: "The VFD quote is commercially incomplete. A visible clarification state prevents false savings from entering the recommendation.",
  },
] as const;

const toneClasses = {
  positive: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  review: "border-rose-400/20 bg-rose-400/10 text-rose-100",
} as const;

const maxCycleBefore = Math.max(
  ...cycleSteps.map((item) => Number.parseFloat(item.before)),
);

function MetricCard({
  eyebrow,
  value,
  label,
}: {
  eyebrow: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.28em] text-stone-400">{eyebrow}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{label}</p>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.3em] text-orange-300">{kicker}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-stone-600 md:text-lg">{body}</p>
    </div>
  );
}

export function CaseStudyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#171918] text-stone-100">
      <header className="border-b border-white/10 bg-[#171918]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full border border-orange-300/30 bg-orange-300/10">
              <Factory className="size-4 text-orange-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">RFQ AI</p>
              <p className="text-xs text-stone-400">Procurement case study</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="hidden text-sm text-stone-300 sm:block">
              Product
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-orange-300 text-stone-950 hover:bg-orange-200">
                Open app
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <Image
              src="/images/procurement-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,180,90,0.18),transparent_28%),linear-gradient(90deg,rgba(23,25,24,0.98)_0%,rgba(23,25,24,0.88)_48%,rgba(23,25,24,0.65)_100%)]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] md:items-center md:py-20">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-orange-200">
                Manufacturing RFQ case study
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                From quote chaos to sourcing clarity.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
                A specialty-chemicals plant needs 24 stainless transfer-pump kits for a Q3
                line expansion. This case study shows how RFQ AI turns fragmented supplier
                quotes into a decision-ready comparison without hiding the trade-offs that
                matter to procurement.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#comparison">
                  <Button className="rounded-full bg-orange-300 px-6 text-stone-950 hover:bg-orange-200">
                    View comparison
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                  >
                    Explore the live app
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#1f2221]/95 p-5">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-stone-400">
                      Award review
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      Pump skid expansion package
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                    3 quotes normalized
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MetricCard eyebrow="Best price" value="$110.9k" label="AlloyWorks" />
                  <MetricCard eyebrow="Fastest path" value="18 days" label="Northline" />
                  <MetricCard eyebrow="Exceptions" value="3" label="Need analyst review" />
                </div>

                <div className="mt-5 space-y-3">
                  {quoteRows.slice(0, 3).map((row) => (
                    <div
                      key={row.item}
                      className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <p className="font-medium text-white">{row.item}</p>
                        <p className="mt-1 text-sm text-stone-400">Decision: {row.decision}</p>
                      </div>
                      <span
                        className={`inline-flex h-fit rounded-full border px-3 py-1 text-xs ${toneClasses[row.tone]}`}
                      >
                        {row.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f1ea] px-6 py-16 text-stone-950 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="The operating problem"
              title="The analyst’s real job is not transcribing quotes. It is choosing well under constraints."
              body="The scenario is intentionally familiar to manufacturing procurement: uneven supplier documents, one hard project date, and enough exceptions that the cheapest line is not automatically the best decision."
            />

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ClipboardCheck className="size-5 text-stone-500" />
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-stone-500">
                    Before: manual and disconnected
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  {workflowBefore.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-1 size-2 rounded-full bg-stone-400" />
                      <p className="leading-7 text-stone-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-stone-900 bg-stone-950 p-6 text-stone-100 shadow-xl shadow-stone-900/10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-orange-200" />
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-200">
                    After: standardized and visible
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  {workflowAfter.map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="mt-1 size-2 rounded-full bg-orange-200" />
                      <p className="leading-7 text-stone-200">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comparison" className="bg-[#ece6dd] px-6 py-16 text-stone-950 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Quote comparison"
              title="One matrix, three suppliers, four decision traps."
              body="Each line carries the commercial information an analyst actually needs to defend an award recommendation: price, lead time, MOQ, completeness, and the reason the preferred supplier wins."
            />

            <div className="mt-10 overflow-hidden rounded-[2rem] border border-stone-300 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-stone-950 text-stone-100">
                    <tr>
                      <th className="px-5 py-4 text-sm font-medium">Line item</th>
                      <th className="px-5 py-4 text-sm font-medium">Need</th>
                      <th className="px-5 py-4 text-sm font-medium">AlloyWorks</th>
                      <th className="px-5 py-4 text-sm font-medium">Northline</th>
                      <th className="px-5 py-4 text-sm font-medium">DeltaForge</th>
                      <th className="px-5 py-4 text-sm font-medium">Analyst call</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteRows.map((row) => (
                      <tr key={row.item} className="border-t border-stone-200 align-top">
                        <td className="px-5 py-5 font-medium">{row.item}</td>
                        <td className="px-5 py-5 text-stone-600">{row.required}</td>
                        <td className="px-5 py-5 text-sm leading-6 text-stone-700">
                          {row.alloyWorks}
                        </td>
                        <td className="px-5 py-5 text-sm leading-6 text-stone-700">
                          {row.northline}
                        </td>
                        <td className="px-5 py-5 text-sm leading-6 text-stone-700">
                          {row.deltaForge}
                        </td>
                        <td className="px-5 py-5">
                          <div className="space-y-2">
                            <p className="font-medium">{row.decision}</p>
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs ${
                                row.tone === "positive"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                  : row.tone === "warning"
                                    ? "border-amber-300 bg-amber-50 text-amber-800"
                                    : "border-rose-300 bg-rose-50 text-rose-800"
                              }`}
                            >
                              {row.risk}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#171918] px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-200">Risk visibility</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                The page makes procurement judgment legible.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-stone-300 md:text-lg">
                A hiring manager can see the move from data handling to decision quality:
                where schedule risk lives, where MOQ distorts the apparent savings, and where
                the right answer is to pause rather than pretend certainty.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <ShieldAlert className="size-5 text-orange-200" />
                <p className="mt-5 text-lg font-medium text-white">Lead-time risk</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Cheapest pump option misses the project window by 17 days.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <FlagTriangleRight className="size-5 text-orange-200" />
                <p className="mt-5 text-lg font-medium text-white">MOQ exposure</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Low seal-kit price creates excess inventory and weakens cash efficiency.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                <Gauge className="size-5 text-orange-200" />
                <p className="mt-5 text-lg font-medium text-white">Data integrity</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Missing VFD pricing is flagged before it pollutes the award logic.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f1ea] px-6 py-16 text-stone-950 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Cycle-time impact"
              title="Modeled sourcing cycle: 5.0 to 2.9 business days."
              body="The app reduces time spent rebuilding the comparison and preserves analyst attention for the harder work: exceptions, negotiation questions, and the final recommendation."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[2rem] border border-stone-900 bg-stone-950 p-6 text-stone-100">
                <div className="flex items-center gap-3">
                  <TimerReset className="size-5 text-orange-200" />
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200">
                    42% faster sourcing cycle
                  </p>
                </div>
                <p className="mt-6 text-5xl font-semibold tracking-tight">2.1 days saved</p>
                <p className="mt-4 max-w-md leading-7 text-stone-300">
                  In the modeled scenario, automation compresses clerical work while keeping
                  human review exactly where it belongs.
                </p>
              </div>

              <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
                <div className="space-y-5">
                  {cycleSteps.map((step) => (
                    <div key={step.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{step.label}</span>
                        <span className="text-stone-500">
                          {step.before} → {step.after}
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                        <div className="flex h-full">
                          <div
                            className="h-full bg-stone-400"
                            style={{
                              width: `${
                                (Number.parseFloat(step.before) / maxCycleBefore) * 100
                              }%`,
                            }}
                          />
                          <div
                            className="h-full bg-orange-300"
                            style={{
                              width: `${(Number.parseFloat(step.after) / maxCycleBefore) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ece6dd] px-6 py-16 text-stone-950 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              kicker="Decision logic"
              title="The recommendation is explainable because the trade-offs are explicit."
              body="That is the part of the project most relevant to procurement and supply-chain analyst roles: not just automating a task, but making better commercial reasoning easier to audit."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {decisionNotes.map((note) => (
                <article
                  key={note.title}
                  className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-lg font-semibold leading-7">{note.title}</p>
                  <p className="mt-4 leading-7 text-stone-600">{note.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
