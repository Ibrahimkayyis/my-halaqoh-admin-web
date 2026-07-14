"use client";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-surface px-8 shadow-sm rounded-b-md">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-primary">
          {title}
        </h1>
      </div>
    </header>
  );
}
