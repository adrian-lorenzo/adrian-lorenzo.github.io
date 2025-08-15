interface BulletListProps {
  items: readonly string[];
}

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          <span className="text-pretty">- {item}</span>
        </li>
      ))}
    </ul>
  );
}
