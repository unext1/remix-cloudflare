import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { forwardRef, useId, useMemo, useState, type ReactNode } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialog';
import { CustomForm, CustomFormProps } from '../custom-form';
import { Button } from './button';

type ComboboxItem<T> = T & {
  value: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
};
type GroupedCombobox<T> = {
  items?: never;
  groupedItems: { title?: string; items: ComboboxItem<T>[] }[];
};
type NotGroupedCombobox<T> = {
  items: ComboboxItem<T>[];
  groupedItems?: never;
};
type MainComboboxProps<T> = {
  name?: string;
  selectedItem?: ComboboxItem<T> | undefined;
  buttonTrigger?: (item: ComboboxItem<T> | undefined, open: boolean) => ReactNode;
  children?: (setClose: () => void) => ReactNode;
};
type ComboboxProps<T> = MainComboboxProps<T> & (GroupedCombobox<T> | NotGroupedCombobox<T>);

export const Combobox = <T,>({
  name,
  buttonTrigger,
  items,
  groupedItems,
  selectedItem,
  children
}: ComboboxProps<T>) => {
  const id = useId();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<ComboboxItem<T> | undefined>(selectedItem);

  const [allItems, flatItems] = useMemo(() => {
    const allItems = (groupedItems ? groupedItems : [{ title: '', items: items ?? [] }]).filter(
      (i) => i.items.length > 0
    );
    const flatItems = allItems.map((group) => group.items).flat();
    return [allItems, flatItems];
  }, [groupedItems, items]);

  return (
    <Popover open={opened} onOpenChange={setOpened}>
      {name ? <input name={name} type="hidden" value={selected?.value} /> : null}
      <PopoverTrigger asChild>
        {buttonTrigger ? (
          buttonTrigger(selected, opened)
        ) : (
          <TriggerButton id={id} isOpen={opened} text={selected?.label ?? 'Select item...'} />
        )}
      </PopoverTrigger>
      <PopoverContent id={id} className="p-0 z-50" align="start">
        <Command
          filter={(value, search) => {
            if (value === 'create') return 1;
            const label = flatItems.find((i) => i.value === value)?.label.toLocaleLowerCase();
            return label?.includes(search.toLocaleLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search item..." />
          <CommandEmpty>No item found.</CommandEmpty>

          <div className="max-h-60 overflow-y-auto">
            {allItems.map((group, index) => (
              <CommandGroup key={`${group.title || ''}-${index}`} heading={group.title}>
                {group.items.map(({ label, value, icon, onSelect }) => {
                  const isSelected = selected?.value === value;

                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(currentValue) => {
                        setSelected(group.items.find((item) => item.value === currentValue));
                        setOpened(false);
                        onSelect && selected?.value !== value && onSelect();
                      }}
                    >
                      {icon && !isSelected ? (
                        icon
                      ) : (
                        <Check className={cn('mr-2 h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
                      )}
                      <span className="truncate">{label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </div>

          {children ? children(() => setOpened(false)) : null}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const TriggerButton = forwardRef<HTMLButtonElement, { id: string; text: string; isOpen: boolean }>(
  ({ id, text, isOpen, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      role="combobox"
      aria-controls={id}
      aria-expanded={isOpen}
      className="input input-md h-auto w-full rounded-md py-1 px-2.5 input-bordered"
    >
      <div className="inline-flex items-center justify-between w-full">
        <span className="truncate">{text}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>
    </button>
  )
);
TriggerButton.displayName = 'TriggerButton';

type ComboboxWithDialogProps<T> = {
  combobox: ComboboxProps<T>;
  dialog: {
    title: string;
    description?: string;
  };
  form: CustomFormProps;
  children: ReactNode;
};
export const ComboboxWithAction = <T,>({ combobox, dialog, form, children }: ComboboxWithDialogProps<T>) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog} modal>
      <Combobox {...combobox}>
        {(setClose) => (
          <>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setClose();
                      setShowDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    {dialog.title}
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </>
        )}
      </Combobox>
      <DialogContent>
        <CustomForm {...form}>
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              {dialog.description ? <DialogDescription>{dialog.description}</DialogDescription> : null}
            </DialogHeader>

            <div className="space-y-2">{children}</div>

            <DialogFooter>
              <Button type="button" className="btn-outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-neutral">
                Continue
              </Button>
            </DialogFooter>
          </div>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
};

type DialogFormProps = {
  dialog: {
    title: string;
    description?: string;
  };
  form: CustomFormProps;
  children: ReactNode;
};
export const DialogForm = ({ dialog, form, children }: DialogFormProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog} modal>
      <DialogTrigger asChild>
        <button>me</button>
      </DialogTrigger>
      <DialogContent>
        <CustomForm {...form}>
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              {dialog.description ? <DialogDescription>{dialog.description}</DialogDescription> : null}
            </DialogHeader>

            <div className="space-y-2">{children}</div>

            <DialogFooter>
              <Button type="button" className="btn-outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-neutral">
                Continue
              </Button>
            </DialogFooter>
          </div>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
};
