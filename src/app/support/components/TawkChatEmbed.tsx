'use client';

type Props = {
  chatUrl: string;
  height?: number;
};

export default function TawkChatEmbed({
  chatUrl,
  height = 520
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
      <iframe
        src={chatUrl}
        title="Rentera Support Chat"
        className="w-full"
        style={{ height }}
        frameBorder="0"
        allow="microphone; camera"
      />
    </div>
  );
}
