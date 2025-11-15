import { ComponentDoc } from '@/types/docs';

interface DocumentationCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  components: ComponentDoc[];
}

export const documentationData: DocumentationCategory[] = [
  {
    id: 'forms',
    title: 'Form Components',
    description: 'Interactive form elements for user input and data collection',
    color: 'bg-orange',
    components: [
      {
        id: 'button',
        name: 'Button',
        category: 'Forms',
        description: 'A clickable button component with multiple variants and sizes',
        path: '@/components/ui/button',
        props: [
          {
            name: 'variant',
            type: 'default | destructive | outline | secondary | ghost | link',
            description: 'The visual style variant of the button',
            required: false,
            default: 'default'
          },
          {
            name: 'size',
            type: 'default | sm | lg | icon',
            description: 'The size of the button',
            required: false,
            default: 'default'
          },
          {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the button is disabled',
            required: false,
            default: 'false'
          }
        ],
        examples: [
          {
            title: 'Basic Button',
            code: `import { Button } from '@/components/ui/button';

export function Example() {
  return <Button>Click me</Button>;
}`
          },
          {
            title: 'Button Variants',
            code: `import { Button } from '@/components/ui/button';

export function Example() {
  return (
    <div className="flex gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
}`
          }
        ]
      },
      {
        id: 'input',
        name: 'Input',
        category: 'Forms',
        description: 'Text input field for user data entry',
        path: '@/components/ui/input',
        props: [
          {
            name: 'type',
            type: 'text | email | password | number',
            description: 'The HTML input type',
            required: false,
            default: 'text'
          },
          {
            name: 'placeholder',
            type: 'string',
            description: 'Placeholder text',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Input',
            code: `import { Input } from '@/components/ui/input';

export function Example() {
  return <Input placeholder="Enter text" />;
}`
          }
        ]
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        category: 'Forms',
        description: 'Checkbox input for boolean selections',
        path: '@/components/ui/checkbox',
        props: [
          {
            name: 'checked',
            type: 'boolean',
            description: 'Whether the checkbox is checked',
            required: false
          },
          {
            name: 'onCheckedChange',
            type: '(checked: boolean) => void',
            description: 'Callback when checked state changes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Checkbox',
            code: `import { Checkbox } from '@/components/ui/checkbox';

export function Example() {
  return <Checkbox />;
}`
          }
        ]
      },
      {
        id: 'radio-group',
        name: 'Radio Group',
        category: 'Forms',
        description: 'Radio button group for single selection',
        path: '@/components/ui/radio-group',
        props: [
          {
            name: 'value',
            type: 'string',
            description: 'The selected value',
            required: false
          },
          {
            name: 'onValueChange',
            type: '(value: string) => void',
            description: 'Callback when selection changes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Radio Group',
            code: `import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function Example() {
  return (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1" />
      <RadioGroupItem value="option2" />
    </RadioGroup>
  );
}`
          }
        ]
      },
      {
        id: 'select',
        name: 'Select',
        category: 'Forms',
        description: 'Dropdown select component for choosing options',
        path: '@/components/ui/select',
        props: [
          {
            name: 'value',
            type: 'string',
            description: 'The selected value',
            required: false
          },
          {
            name: 'onValueChange',
            type: '(value: string) => void',
            description: 'Callback when selection changes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Select',
            code: `import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

export function Example() {
  return (
    <Select>
      <SelectTrigger>Select an option</SelectTrigger>
      <SelectContent>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}`
          }
        ]
      },
      {
        id: 'textarea',
        name: 'Textarea',
        category: 'Forms',
        description: 'Multi-line text input field',
        path: '@/components/ui/textarea',
        props: [
          {
            name: 'placeholder',
            type: 'string',
            description: 'Placeholder text',
            required: false
          },
          {
            name: 'rows',
            type: 'number',
            description: 'Number of visible text lines',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Textarea',
            code: `import { Textarea } from '@/components/ui/textarea';

export function Example() {
  return <Textarea placeholder="Enter your message" />;
}`
          }
        ]
      },
      {
        id: 'switch',
        name: 'Switch',
        category: 'Forms',
        description: 'Toggle switch for on/off states',
        path: '@/components/ui/switch',
        props: [
          {
            name: 'checked',
            type: 'boolean',
            description: 'Whether the switch is on',
            required: false
          },
          {
            name: 'onCheckedChange',
            type: '(checked: boolean) => void',
            description: 'Callback when state changes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Switch',
            code: `import { Switch } from '@/components/ui/switch';

export function Example() {
  return <Switch />;
}`
          }
        ]
      },
      {
        id: 'slider',
        name: 'Slider',
        category: 'Forms',
        description: 'Range slider for selecting numeric values',
        path: '@/components/ui/slider',
        props: [
          {
            name: 'value',
            type: 'number[]',
            description: 'Current slider value(s)',
            required: false
          },
          {
            name: 'min',
            type: 'number',
            description: 'Minimum value',
            required: false,
            default: '0'
          },
          {
            name: 'max',
            type: 'number',
            description: 'Maximum value',
            required: false,
            default: '100'
          }
        ],
        examples: [
          {
            title: 'Basic Slider',
            code: `import { Slider } from '@/components/ui/slider';

export function Example() {
  return <Slider defaultValue={[50]} max={100} />;
}`
          }
        ]
      },
      {
        id: 'label',
        name: 'Label',
        category: 'Forms',
        description: 'Form label for associating text with inputs',
        path: '@/components/ui/label',
        props: [
          {
            name: 'htmlFor',
            type: 'string',
            description: 'ID of the input element',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Label',
            code: `import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function Example() {
  return (
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: 'layout',
    title: 'Layout Components',
    description: 'Components for structuring and organizing content',
    color: 'bg-orange-dark',
    components: [
      {
        id: 'card',
        name: 'Card',
        category: 'Layout',
        description: 'Container component with header, content, and footer sections',
        path: '@/components/ui/card',
        props: [
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS classes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Card',
            code: `import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
    </Card>
  );
}`
          }
        ]
      },
      {
        id: 'tabs',
        name: 'Tabs',
        category: 'Layout',
        description: 'Organize content into switchable panels',
        path: '@/components/ui/tabs',
        props: [
          {
            name: 'defaultValue',
            type: 'string',
            description: 'Default active tab',
            required: true
          }
        ],
        examples: [
          {
            title: 'Basic Tabs',
            code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );
}`
          }
        ]
      },
      {
        id: 'accordion',
        name: 'Accordion',
        category: 'Layout',
        description: 'Expandable/collapsible content sections',
        path: '@/components/ui/accordion',
        props: [
          {
            name: 'type',
            type: 'single | multiple',
            description: 'Whether single or multiple items can be open',
            required: true
          }
        ],
        examples: [
          {
            title: 'Basic Accordion',
            code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`
          }
        ]
      },
      {
        id: 'separator',
        name: 'Separator',
        category: 'Layout',
        description: 'Visual divider between content sections',
        path: '@/components/ui/separator',
        props: [
          {
            name: 'orientation',
            type: 'horizontal | vertical',
            description: 'Orientation of the separator',
            required: false,
            default: 'horizontal'
          }
        ],
        examples: [
          {
            title: 'Basic Separator',
            code: `import { Separator } from '@/components/ui/separator';

export function Example() {
  return (
    <div>
      <div>Content above</div>
      <Separator />
      <div>Content below</div>
    </div>
  );
}`
          }
        ]
      },
      {
        id: 'aspect-ratio',
        name: 'Aspect Ratio',
        category: 'Layout',
        description: 'Maintain consistent aspect ratios for content',
        path: '@/components/ui/aspect-ratio',
        props: [
          {
            name: 'ratio',
            type: 'number',
            description: 'Aspect ratio value',
            required: false,
            default: '16/9'
          }
        ],
        examples: [
          {
            title: 'Basic Aspect Ratio',
            code: `import { AspectRatio } from '@/components/ui/aspect-ratio';

export function Example() {
  return (
    <AspectRatio ratio={16/9}>
      <img src="image.jpg" alt="Image" />
    </AspectRatio>
  );
}`
          }
        ]
      },
      {
        id: 'scroll-area',
        name: 'Scroll Area',
        category: 'Layout',
        description: 'Scrollable container with custom scrollbar',
        path: '@/components/ui/scroll-area',
        props: [
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS classes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Scroll Area',
            code: `import { ScrollArea } from '@/components/ui/scroll-area';

export function Example() {
  return (
    <ScrollArea className="h-72">
      <div>Long content here...</div>
    </ScrollArea>
  );
}`
          }
        ]
      },
      {
        id: 'collapsible',
        name: 'Collapsible',
        category: 'Layout',
        description: 'Container that can expand and collapse',
        path: '@/components/ui/collapsible',
        props: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Whether the content is expanded',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Collapsible',
            code: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Hidden content</CollapsibleContent>
    </Collapsible>
  );
}`
          }
        ]
      },
      {
        id: 'resizable',
        name: 'Resizable',
        category: 'Layout',
        description: 'Resizable panel layout system',
        path: '@/components/ui/resizable',
        props: [
          {
            name: 'direction',
            type: 'horizontal | vertical',
            description: 'Direction of resizing',
            required: false,
            default: 'horizontal'
          }
        ],
        examples: [
          {
            title: 'Basic Resizable',
            code: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export function Example() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>Panel 1</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Panel 2</ResizablePanel>
    </ResizablePanelGroup>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: 'feedback',
    title: 'Feedback Components',
    description: 'Components for displaying messages and notifications',
    color: 'bg-black-light',
    components: [
      {
        id: 'alert',
        name: 'Alert',
        category: 'Feedback',
        description: 'Display important messages or notifications',
        path: '@/components/ui/alert',
        props: [
          {
            name: 'variant',
            type: 'default | destructive',
            description: 'Visual style of alert',
            required: false,
            default: 'default'
          }
        ],
        examples: [
          {
            title: 'Basic Alert',
            code: `import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function Example() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Important message here</AlertDescription>
    </Alert>
  );
}`
          }
        ]
      },
      {
        id: 'badge',
        name: 'Badge',
        category: 'Feedback',
        description: 'Small label or status indicator',
        path: '@/components/ui/badge',
        props: [
          {
            name: 'variant',
            type: 'default | secondary | destructive | outline',
            description: 'Visual style',
            required: false,
            default: 'default'
          }
        ],
        examples: [
          {
            title: 'Badge Variants',
            code: `import { Badge } from '@/components/ui/badge';

export function Example() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}`
          }
        ]
      },
      {
        id: 'toast',
        name: 'Toast',
        category: 'Feedback',
        description: 'Temporary notification messages',
        path: '@/components/ui/toast',
        props: [
          {
            name: 'title',
            type: 'string',
            description: 'Toast title',
            required: false
          },
          {
            name: 'description',
            type: 'string',
            description: 'Toast description',
            required: false
          }
        ],
        examples: [
          {
            title: 'Show Toast',
            code: `import { useToast } from '@/components/ui/use-toast';

export function Example() {
  const { toast } = useToast();
  
  return (
    <button onClick={() => toast({ title: 'Success!' })}>
      Show Toast
    </button>
  );
}`
          }
        ]
      },
      {
        id: 'progress',
        name: 'Progress',
        category: 'Feedback',
        description: 'Progress bar indicator',
        path: '@/components/ui/progress',
        props: [
          {
            name: 'value',
            type: 'number',
            description: 'Progress value (0-100)',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Progress',
            code: `import { Progress } from '@/components/ui/progress';

export function Example() {
  return <Progress value={60} />;
}`
          }
        ]
      },
      {
        id: 'skeleton',
        name: 'Skeleton',
        category: 'Feedback',
        description: 'Loading placeholder component',
        path: '@/components/ui/skeleton',
        props: [
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS classes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Skeleton',
            code: `import { Skeleton } from '@/components/ui/skeleton';

export function Example() {
  return <Skeleton className="h-12 w-full" />;
}`
          }
        ]
      },
      {
        id: 'sonner',
        name: 'Sonner',
        category: 'Feedback',
        description: 'Advanced toast notification system',
        path: '@/components/ui/sonner',
        props: [
          {
            name: 'position',
            type: 'top-left | top-right | bottom-left | bottom-right',
            description: 'Toast position',
            required: false,
            default: 'bottom-right'
          }
        ],
        examples: [
          {
            title: 'Using Sonner',
            code: `import { toast } from 'sonner';

export function Example() {
  return (
    <button onClick={() => toast('Event has been created')}>
      Show Toast
    </button>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: 'navigation',
    title: 'Navigation Components',
    description: 'Components for site navigation and menus',
    color: 'bg-primary',
    components: [
      {
        id: 'menubar',
        name: 'Menubar',
        category: 'Navigation',
        description: 'Horizontal menu bar with dropdowns',
        path: '@/components/ui/menubar',
        props: [
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS classes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Menubar',
            code: `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar';

export function Example() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`
          }
        ]
      },
      {
        id: 'navigation-menu',
        name: 'Navigation Menu',
        category: 'Navigation',
        description: 'Complex navigation menu system',
        path: '@/components/ui/navigation-menu',
        props: [
          {
            name: 'orientation',
            type: 'horizontal | vertical',
            description: 'Menu orientation',
            required: false,
            default: 'horizontal'
          }
        ],
        examples: [
          {
            title: 'Basic Navigation Menu',
            code: `import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>Home</NavigationMenuItem>
        <NavigationMenuItem>About</NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`
          }
        ]
      },
      {
        id: 'breadcrumb',
        name: 'Breadcrumb',
        category: 'Navigation',
        description: 'Hierarchical navigation trail',
        path: '@/components/ui/breadcrumb',
        props: [
          {
            name: 'separator',
            type: 'ReactNode',
            description: 'Custom separator element',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Breadcrumb',
            code: `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}`
          }
        ]
      },
      {
        id: 'pagination',
        name: 'Pagination',
        category: 'Navigation',
        description: 'Page navigation controls',
        path: '@/components/ui/pagination',
        props: [
          {
            name: 'currentPage',
            type: 'number',
            description: 'Current active page',
            required: true
          },
          {
            name: 'totalPages',
            type: 'number',
            description: 'Total number of pages',
            required: true
          }
        ],
        examples: [
          {
            title: 'Basic Pagination',
            code: `import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

export function Example() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: 'overlay',
    title: 'Overlay Components',
    description: 'Modal dialogs, popovers, and overlay elements',
    color: 'bg-bronze',
    components: [
      {
        id: 'dialog',
        name: 'Dialog',
        category: 'Overlay',
        description: 'Modal dialog window',
        path: '@/components/ui/dialog',
        props: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Whether dialog is open',
            required: false
          },
          {
            name: 'onOpenChange',
            type: '(open: boolean) => void',
            description: 'Callback when open state changes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Dialog',
            code: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
        <p>Dialog content</p>
      </DialogContent>
    </Dialog>
  );
}`
          }
        ]
      },
      {
        id: 'popover',
        name: 'Popover',
        category: 'Overlay',
        description: 'Floating content container',
        path: '@/components/ui/popover',
        props: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Whether popover is open',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Popover',
            code: `import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export function Example() {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  );
}`
          }
        ]
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        category: 'Overlay',
        description: 'Contextual information on hover',
        path: '@/components/ui/tooltip',
        props: [
          {
            name: 'delayDuration',
            type: 'number',
            description: 'Delay before showing',
            required: false,
            default: '200'
          }
        ],
        examples: [
          {
            title: 'Basic Tooltip',
            code: `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`
          }
        ]
      },
      {
        id: 'alert-dialog',
        name: 'Alert Dialog',
        category: 'Overlay',
        description: 'Modal alert requiring user action',
        path: '@/components/ui/alert-dialog',
        props: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Whether alert is open',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Alert Dialog',
            code: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  );
}`
          }
        ]
      },
      {
        id: 'dropdown-menu',
        name: 'Dropdown Menu',
        category: 'Overlay',
        description: 'Dropdown menu with actions',
        path: '@/components/ui/dropdown-menu',
        props: [
          {
            name: 'open',
            type: 'boolean',
            description: 'Whether menu is open',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Dropdown Menu',
            code: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`
          }
        ]
      },
      {
        id: 'context-menu',
        name: 'Context Menu',
        category: 'Overlay',
        description: 'Right-click context menu',
        path: '@/components/ui/context-menu',
        props: [
          {
            name: 'className',
            type: 'string',
            description: 'Additional CSS classes',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Context Menu',
            code: `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

export function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>Right click me</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Action 1</ContextMenuItem>
        <ContextMenuItem>Action 2</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`
          }
        ]
      },
      {
        id: 'hover-card',
        name: 'Hover Card',
        category: 'Overlay',
        description: 'Rich content on hover',
        path: '@/components/ui/hover-card',
        props: [
          {
            name: 'openDelay',
            type: 'number',
            description: 'Delay before opening',
            required: false,
            default: '200'
          }
        ],
        examples: [
          {
            title: 'Basic Hover Card',
            code: `import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger>Hover me</HoverCardTrigger>
      <HoverCardContent>Rich content here</HoverCardContent>
    </HoverCard>
  );
}`
          }
        ]
      },
      {
        id: 'sheet',
        name: 'Sheet',
        category: 'Overlay',
        description: 'Slide-out side panel',
        path: '@/components/ui/sheet',
        props: [
          {
            name: 'side',
            type: 'top | right | bottom | left',
            description: 'Which side to slide from',
            required: false,
            default: 'right'
          }
        ],
        examples: [
          {
            title: 'Basic Sheet',
            code: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function Example() {
  return (
    <Sheet>
      <SheetTrigger>Open Sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetHeader>
        <p>Sheet content</p>
      </SheetContent>
    </Sheet>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: 'data-display',
    title: 'Data Display Components',
    description: 'Components for displaying structured data',
    color: 'bg-orange',
    components: [
      {
        id: 'table',
        name: 'Table',
        category: 'Data Display',
        description: 'Data table with sorting and filtering',
        path: '@/components/ui/table',
        props: [
          {
            name: 'data',
            type: 'Array<any>',
            description: 'Table data array',
            required: true
          },
          {
            name: 'columns',
            type: 'ColumnDef[]',
            description: 'Column definitions',
            required: true
          }
        ],
        examples: [
          {
            title: 'Basic Table',
            code: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`
          }
        ]
      },
      {
        id: 'avatar',
        name: 'Avatar',
        category: 'Data Display',
        description: 'User profile image or initials',
        path: '@/components/ui/avatar',
        props: [
          {
            name: 'src',
            type: 'string',
            description: 'Image source URL',
            required: false
          },
          {
            name: 'alt',
            type: 'string',
            description: 'Alt text for image',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Avatar',
            code: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Example() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.jpg" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`
          }
        ]
      },
      {
        id: 'calendar',
        name: 'Calendar',
        category: 'Data Display',
        description: 'Date picker calendar component',
        path: '@/components/ui/calendar',
        props: [
          {
            name: 'selected',
            type: 'Date',
            description: 'Selected date',
            required: false
          },
          {
            name: 'onSelect',
            type: '(date: Date) => void',
            description: 'Callback when date is selected',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Calendar',
            code: `import { Calendar } from '@/components/ui/calendar';

export function Example() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return <Calendar selected={date} onSelect={setDate} />;
}`
          }
        ]
      },
      {
        id: 'command',
        name: 'Command',
        category: 'Data Display',
        description: 'Command palette / search component',
        path: '@/components/ui/command',
        props: [
          {
            name: 'value',
            type: 'string',
            description: 'Search query value',
            required: false
          }
        ],
        examples: [
          {
            title: 'Basic Command',
            code: `import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';

export function Example() {
  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandItem>Item 1</CommandItem>
        <CommandItem>Item 2</CommandItem>
      </CommandList>
    </Command>
  );
}`
          }
        ]
      }
    ]
  }
];
