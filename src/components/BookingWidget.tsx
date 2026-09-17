import { useState, useMemo } from "preact/hooks";

type Stay = { checkIn: string; checkOut: string; guests: number };

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingWidget() {
  const [stay, setStay] = useState<Stay>({
    checkIn: todayPlus(14),
    checkOut: todayPlus(17),
    guests: 2,
  });
  const [submitted, setSubmitted] = useState(false);

  const nights = useMemo(() => {
    const a = new Date(stay.checkIn).getTime();
    const b = new Date(stay.checkOut).getTime();
    if (isNaN(a) || isNaN(b) || b <= a) return 0;
    return Math.round((b - a) / 86_400_000);
  }, [stay.checkIn, stay.checkOut]);

  const rate = 640;
  const total = nights * rate;

  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (nights < 1) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <form
      onSubmit={onSubmit}
      class="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-ink-900/80 p-6 backdrop-blur-md sm:p-8"
    >
      <div class="mb-6 flex items-baseline justify-between">
        <div>
          <p class="font-display text-2xl text-snow">Plan your stay</p>
          <p class="mt-1 text-xs tracking-[0.25em] uppercase text-frost-400">
            Live availability
          </p>
        </div>
        <div class="text-right">
          <p class="font-display text-2xl text-snow">${rate}</p>
          <p class="text-xs text-frost-400">per night</p>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <label class="flex flex-col gap-2 text-xs tracking-[0.2em] uppercase text-frost-400">
          Check-in
          <input
            type="date"
            value={stay.checkIn}
            min={todayPlus(0)}
            onChange={(e) =>
              setStay((s) => ({
                ...s,
                checkIn: (e.target as HTMLInputElement).value,
              }))
            }
            class="rounded-xl border border-white/15 bg-ink-800 px-3 py-3 text-sm normal-case tracking-normal text-snow focus:border-ember focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-2 text-xs tracking-[0.2em] uppercase text-frost-400">
          Check-out
          <input
            type="date"
            value={stay.checkOut}
            min={stay.checkIn}
            onChange={(e) =>
              setStay((s) => ({
                ...s,
                checkOut: (e.target as HTMLInputElement).value,
              }))
            }
            class="rounded-xl border border-white/15 bg-ink-800 px-3 py-3 text-sm normal-case tracking-normal text-snow focus:border-ember focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-2 text-xs tracking-[0.2em] uppercase text-frost-400">
          Guests
          <select
            value={stay.guests}
            onChange={(e) =>
              setStay((s) => ({
                ...s,
                guests: Number((e.target as HTMLSelectElement).value),
              }))
            }
            class="rounded-xl border border-white/15 bg-ink-800 px-3 py-3 text-sm normal-case tracking-normal text-snow focus:border-ember focus:outline-none"
          >
            {[1, 2, 3, 4].map((n) => (
              <option value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </label>
      </div>

      <div class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-frost-200">
          {nights > 0 ? (
            <>
              <span class="font-medium text-snow">{nights} {nights === 1 ? "night" : "nights"}</span>
              <span class="mx-2 text-frost-500">·</span>
              <span>${total.toLocaleString()} total</span>
            </>
          ) : (
            <span class="text-frost-400">Check-out must be after check-in</span>
          )}
        </div>
        <button
          type="submit"
          disabled={nights < 1}
          class="inline-flex items-center justify-center gap-2 rounded-full bg-snow px-6 py-3 text-sm font-medium text-ink-950 transition hover:bg-ember disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitted ? "Inquiry sent ✓" : "Request to book"}
        </button>
      </div>
    </form>
  );
}
