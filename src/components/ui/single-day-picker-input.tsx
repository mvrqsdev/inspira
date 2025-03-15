import { format } from 'date-fns'
import { Info } from 'lucide-react'

import { useDisclosure } from '@/hooks/use-disclosure'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { DayPicker } from '@/components/ui/day-picker'

import { cn } from '@/lib/utils'

import type { ButtonHTMLAttributes } from 'react'
import { ptBR } from 'date-fns/locale'

// ================================== //

type TProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onSelect' | 'value'
> & {
  readonly onSelect: (value: Date | undefined) => void
  readonly value?: Date | undefined
  readonly placeholder: string
  readonly labelVariant?: 'P' | 'PP' | 'PPP'
}

function SingleDayPickerInput({
  id,
  onSelect,
  className,
  placeholder,
  labelVariant = 'PPP',
  value,
  ...props
}: TProps) {
  const { isOpen, onClose, onToggle } = useDisclosure()

  const handleSelect = (date: Date | undefined) => {
    onSelect(date)
    onClose()
  }

  return (
    <Popover open={isOpen} onOpenChange={onToggle} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'group relative h-9 w-full justify-start whitespace-nowrap px-3 py-2 font-normal hover:bg-inherit',
            'disabled:bg-bg-disabled disabled:text-t-disabled hover:disabled:bg-bg-disabled',
            'data-[invalid=true]:border-error-500 data-[invalid=true]:bg-error-50 data-[invalid=true]:pr-9 data-[invalid=true]:focus-visible:outline-error-300',
            'dark:data-[invalid=true]:border-error-900 dark:data-[invalid=true]:bg-red-950/20 dark:data-[invalid=true]:focus-visible:outline-error-950',
            className,
          )}
          {...props}
        >
          {value && (
            <span>{format(value, labelVariant, { locale: ptBR })}</span>
          )}
          {!value && <span className="text-t-placeholder">{placeholder}</span>}

          <div className="pointer-events-none absolute inset-y-0 end-0 hidden items-center justify-center pr-3 text-error-600 group-data-[invalid=true]:flex">
            <Info className="size-4" aria-hidden="true" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-2">
        <DayPicker
          className="p-1"
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ================================== //

export { SingleDayPickerInput }
