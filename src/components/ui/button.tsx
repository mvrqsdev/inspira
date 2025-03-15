import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        unstyled: 'gap-0 px-0 text-base font-normal',
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-bg-disabled disabled:text-t-disabled',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        xs: 'h-8 px-3 text-sm [&>svg]:size-3.5',
        md: 'h-10 px-3.5 text-sm [&>svg]:size-5',
        xl: 'h-12 rounded-lg px-4.5 text-base [&>svg]:size-5',
        '2xl': 'h-14 rounded-lg px-5.5 text-lg [&>svg]:size-7',
        'icon-xxxs': 'size-6 [&>svg]:size-4.5',
        'icon-xxs': 'size-7 [&>svg]:size-4.5',
        'icon-xs': 'size-8 [&>svg]:size-4.5',
        'icon-sm': 'size-9 [&>svg]:size-5',
        'icon-md': 'size-10 [&>svg]:size-5',
        'icon-lg': 'size-11 [&>svg]:size-5',
        'icon-xl': 'size-12 [&>svg]:size-6',
        'icon-2xl': 'size-14 [&>svg]:size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
const buttonGroupVariants = cva('inline-flex', {
  variants: {
    variant: {
      primary: '',
      destructive: '',
      outline: '',
      ghost: '',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      '2xl': '',
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'sm',
  },
})

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }

interface ButtonGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    { className, variant = 'outline', size = 'sm', children, ...props },
    ref,
  ) => {
    const groupClasses = cn(buttonGroupVariants({ variant, size, className }))

    return (
      <div ref={ref} className={groupClasses} {...props}>
        {Children.map(children, (child, index) => {
          if (isValidElement<TButtonProps>(child) && child.type === Button) {
            const isIconOnly =
              Children.count(child.props.children) === 1 &&
              isValidElement(child.props.children)

            return cloneElement(child, {
              variant,
              size:
                isIconOnly &&
                (index === 0 || index === Children.count(children) - 1)
                  ? `icon-${size!}`
                  : size,
              className: cn(
                child.props.className,
                'first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none',
                index !== 0 && '-ml-px',
              ),
            })
          }
          return child
        })}
      </div>
    )
  },
)

ButtonGroup.displayName = 'ButtonGroup'

export { Button, ButtonGroup, buttonVariants }
