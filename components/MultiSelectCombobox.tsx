"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Skill {
  id: number;
  name: string;
}

interface MultiSelectComboboxProps {
  allSkills: Skill[];
  selectedSkills: Skill[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  allSkills,
  selectedSkills,
  setSelectedSkills,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const form = useForm();

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSkills.some((selected) => selected.id === skill.id)
  );

  const handleSelect = (skill: Skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setInputValue("");
  };

  const handleRemove = (skill: Skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
  };

  // Ref for the CommandList
  const commandListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && commandListRef.current) {
      commandListRef.current.focus();
    }
  }, [open]);

  return (
    <Form {...form}>
      <FormField
        name="skills"
        render={() => (
          <FormItem className="flex flex-col">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !selectedSkills.length && "text-muted-foreground"
                    )}
                  >
                    <span className="font-normal">
                    {selectedSkills.length > 0
                      ? `${selectedSkills.length} selected`
                      : "Select skills"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search skills..."
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                  <CommandList
                    ref={commandListRef}
                    tabIndex={0} // Make it focusable
                    className="max-h-[200px] overflow-y-auto p-0"
                    onWheel={(e) => e.stopPropagation()} // Prevent event bubbling
                  >
                    <CommandEmpty>No skills found.</CommandEmpty>
                    <CommandGroup>
                      {filteredSkills.map((skill) => (
                        <CommandItem
                          key={skill.id}
                          value={skill.name}
                          onSelect={() => handleSelect(skill)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSkills.some((s) => s.id === skill.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {skill.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
            {selectedSkills.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="hover:bg-secondary"
                  >
                    {skill.name}
                    <button
                      type="button"
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => handleRemove(skill)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill.name}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        )}
      />
    </Form>
  );
};

export default MultiSelectCombobox;
