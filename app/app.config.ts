export default defineAppConfig({
  ui: {
    button: {
      slots: { base: 'justify-center text-center cursor-pointer' },
      variants: {
        block: {
          true: { trailingIcon: 'ms-0' }
        }
      }
    },
    formField: {
      slots: {
        label: 'text-sm font-[550] text-[#dedee4]',
        help: 'text-xs leading-[1.6] text-[#9297a3]',
        hint: 'text-xs'
      }
    },
    input: {
      slots: {
        base: 'min-h-[49px] rounded-[9px] bg-[#17181d] text-sm placeholder:text-[#9094a0] focus-visible:ring-0'
      }
    },
    colors: {
      primary: 'orange',
      neutral: 'zinc'
    }
  }
})
