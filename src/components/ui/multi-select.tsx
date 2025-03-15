import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Separator } from './separator'
import { Badge } from './badge'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from './command'
import { cn } from '@/lib/utils'
import React from 'react'

export interface ItemProps {
  value: string
  label: string
  element?: React.ReactNode
}

interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  placeholder: string
  options: ItemProps[]
  defaultValues?: string[]
  onChange: (selected: string[]) => void
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onChange,
      defaultValues = [],
      placeholder = 'Selecione as Opções',
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = React.useState<string[]>(defaultValues)

    React.useEffect(() => {
      if (JSON.stringify(selected) !== JSON.stringify(defaultValues)) {
        onChange?.(selected)
      }
    }, [selected, defaultValues, onChange])

    function toggleSelection(value: string) {
      setSelected((prevSelected) => {
        const isSelected = prevSelected.includes(value)
        return isSelected
          ? prevSelected.filter((item) => item !== value)
          : [...prevSelected, value]
      })
    }

    const truncateName = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text

      // Usa regex para cortar o texto e evitar espaços no final
      const truncated = text.slice(0, maxLength).replace(/\s+$/, '')

      return `${truncated}...`
    }

    return (
      <Popover modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-start max-h-9 h-9 border border-input"
            ref={ref}
            {...props}
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            <Separator orientation="vertical" className="mx-2 h-4" />
            {selected.length === 0 && (
              <span className="text-xs text-muted-foreground font-normal">
                {placeholder}
              </span>
            )}
            <div className="flex gap-0.5 flex-nowrap h-full overflow-hidden">
              {selected.length > 2 ? (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selected.length} Selecionadas
                </Badge>
              ) : (
                selected
                  .map((value) => options.find((opt) => opt.value === value))
                  .filter(Boolean)
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option!.value}
                      className="rounded-sm px-1 border-input font-medium"
                    >
                      <div className="flex gap-1.5 items-center justify-center truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateName(option!.label, 15)}
                        {/* {option!.label} */}
                      </div>
                    </Badge>
                  ))
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="w-[--radix-popover-trigger-width] max-w-[--radix-popover-trigger-width] p-0 align-start border border-input rounded-md"
        >
          <Command className="w-full">
            <CommandInput placeholder="Pesquisar..." />
            <CommandList>
              <CommandEmpty className="flex items-center justify-center font-normal text-muted-foreground text-xs h-9">
                Nenhum Resultado encontrado.
              </CommandEmpty>
              <CommandGroup>
                {options.length > 0 && (
                  <CommandGroup>
                    <CommandItem
                      className="justify-center text-center border-b border-input rounded-none cursor-pointer"
                      onSelect={() => {
                        setSelected(options.map((option) => option.value))
                        onChange?.(options.map((option) => option.value))
                      }}
                    >
                      Selecionar Todos
                    </CommandItem>
                  </CommandGroup>
                )}
                {options.map((option) => {
                  const isSelected = selected.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      className="cursor-pointer rounded-none"
                      onSelect={() => toggleSelection(option.value)}
                    >
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1.5 truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                          {option.element && option.element}
                          {truncateName(option.label, 22)}
                        </div>
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckIcon className={cn('h-4 w-4')} />
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {selected.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup className="rounded-none">
                    <CommandItem
                      className="justify-center text-center border-t border-input rounded-none cursor-pointer"
                      onSelect={() => {
                        setSelected([])
                        onChange?.([])
                      }}
                    >
                      Limpar Filtros
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

MultiSelect.displayName = 'MultiSelect'
