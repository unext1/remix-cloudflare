import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { format } from 'date-fns';
import { BellIcon, CalendarIcon, CheckIcon, RocketIcon } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from '~/components/theme-switcher';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/utils';

const notifications = [
  {
    title: 'Your call has been confirmed.',
    description: '1 hour ago'
  },
  {
    title: 'You have a new message!',
    description: '1 hour ago'
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago'
  }
];

export default function Example() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [radioValue, setRadioValue] = useState('all');

  return (
    <div className="flex flex-col items-center justify-center my-10 space-y-4 ">
      <div className="flex space-x-6">
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Demo items!</AlertTitle>
          <AlertDescription>You can add components to your app using the cli.</AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Demo items!</AlertTitle>
          <AlertDescription>You can add components to your app using the cli.</AlertDescription>
        </Alert>
      </div>

      <ThemeToggle />

      <div className="space-x-2">
        <Button variant="default">Button</Button>
        <Button variant="destructive">Button</Button>
        <Button variant="ghost">Button</Button>
        <Button variant="link">Button</Button>
        <Button variant="secondary">Button</Button>
      </div>

      <div className="flex space-x-10">
        <div className="space-y-2 max-w-sm w-full border p-4 rounded-md bg-card">
          <div className="space-x-2">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Badge</Badge>
            <Badge variant="destructive">Badge</Badge>
            <Badge variant="outline">Badge</Badge>
          </div>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                <NavigationMenuContent className="w-full">
                  <NavigationMenuLink className="block w-36 px-2 py-1">Link 1</NavigationMenuLink>
                  <NavigationMenuLink className="block w-36 px-2 py-1">Link 2</NavigationMenuLink>
                  <NavigationMenuLink className="block w-36 px-2 py-1">Link 3</NavigationMenuLink>
                  <NavigationMenuLink className="block w-36 px-2 py-1">Link 4</NavigationMenuLink>
                  <NavigationMenuLink className="block w-36 px-2 py-1">Link 5</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
                <NavigationMenuContent className="w-full">
                  <NavigationMenuLink className="block w-44 px-2 py-1">Link 1</NavigationMenuLink>
                  <NavigationMenuLink className="block w-44 px-2 py-1">Link 2</NavigationMenuLink>
                  <NavigationMenuLink className="block w-44 px-2 py-1">Link 3</NavigationMenuLink>
                  <NavigationMenuLink className="block w-44 px-2 py-1">Link 4</NavigationMenuLink>
                  <NavigationMenuLink className="block w-44 px-2 py-1">Link 5</NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Input placeholder="shadcn" />
          <Input id="picture" type="file" placeholder="Choose file" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
            <Textarea placeholder="Type your message here." />
          </Select>
          <Popover open={isOpenDate} onOpenChange={setIsOpenDate}>
            <PopoverTrigger asChild>
              <Button variant="input" className={cn(!date && 'text-muted-foreground')}>
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setIsOpenDate(false);
                }}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <RadioGroup
            onValueChange={setRadioValue}
            defaultValue={radioValue}
            className="flex flex-col space-y-1 px-1 py-2"
          >
            <RadioGroupItem value="all" label="All new messages" />
            <RadioGroupItem value="mentions" label="Direct messages and mentions" />
            <RadioGroupItem value="none" label="Nothing" />
          </RadioGroup>
          <div className="flex flex-row items-center bg-input justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-1 flex flex-col">
              <Label htmlFor="switch">Marketing emails</Label>
              <Label htmlFor="switch" className="text-muted-foreground text-sm">
                Receive emails about new products, features, and more.
              </Label>
            </div>
            <Switch id="switch" />
          </div>
          <div className="items-top flex space-x-2 py-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">You agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <AspectRatio ratio={16 / 6} className="px-14 py-2 bg-secondary rounded-md">
            <Carousel>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span className="text-4xl font-semibold">{index + 1}</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </AspectRatio>
        </div>

        <div className="space-y-4">
          <Card className={cn('w-[380px]')}>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className=" flex items-center space-x-4 rounded-md border p-4 bg-input">
                <BellIcon />
                <label htmlFor="notify" className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Send notifications to device.</p>
                </label>
                <Switch id="notify" />
              </div>
              <div>
                {notifications.map((notification, index) => (
                  <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-2 max-w-sm w-full border p-4 rounded-md bg-card">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>Yes. Its animated by default, but you can disable it if you prefer.</AccordionContent>
              </AccordionItem>
            </Accordion>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary">Show Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
