'use client';

type Props = {
  title: string;
  subtitle?: string;
};

export default function SupportHero({ title, subtitle }: Props) {
  return (
    <section className="mb-8 md:mb-10">
      <div className="rounded-2xl border bg-background/60 p-5 md:p-8 shadow-sm">
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-2 md:mt-3 text-sm md:text-base opacity-80 max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
