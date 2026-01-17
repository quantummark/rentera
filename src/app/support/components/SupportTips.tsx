'use client';

type Props = {
  items: string[];
};

export default function SupportTips({ items }: Props) {
  return (
    <div className="rounded-2xl border bg-background/60 p-4 md:p-6 shadow-sm">
      <ul className="list-disc space-y-2 pl-5 text-sm opacity-80">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
