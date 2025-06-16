import type React from "react";

export default function InputBox({
  placeholder,
  label,
  reference,
}: {
  placeholder: string;
  label: string;
  reference: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      <div className="flex flex-col mx-8 my-4 shadow-lg">
        <div className="text-sm">{label}:</div>
        <input
          ref={reference}
          type="text"
          placeholder={placeholder}
          className="border-2 rounded-md p-2"
        />
      </div>
    </>
  );
}
