"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { Input } from "@/components/ui/Input";

type PasswordFieldProps = Omit<React.ComponentProps<"input">, "type">;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(props, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className='relative'>
        <Input ref={ref} type={visible ? "text" : "password"} className='pr-12' {...props} />
        <button
          type='button'
          className='absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-foreground'
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>
    );
  },
);
