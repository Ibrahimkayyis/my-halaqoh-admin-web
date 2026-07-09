"use client";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-8 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
    </header>
  );
}
