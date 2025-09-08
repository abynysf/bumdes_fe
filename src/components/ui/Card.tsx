import type { HTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

function CardRoot({
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={clsx("rounded-lg border bg-white shadow-sm", className)}
      {...rest}
    />
  );
}

function Header({
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={clsx("border-b px-4 py-3 text-sm font-semibold", className)}
      {...rest}
    />
  );
}

function Body({
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={clsx("px-4 py-4", className)} {...rest} />;
}

function Footer({
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={clsx("border-t px-4 py-3", className)} {...rest} />;
}

const Card = Object.assign(CardRoot, { Header, Body, Footer });
export default Card;
