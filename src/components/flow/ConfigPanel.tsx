"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getComponentByType, Param } from '@/lib/flow-components';
import { Node } from 'reactflow';
import { ScrollArea } from '../ui/scroll-area';

type ConfigPanelProps = {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
};

export function ConfigPanel({ node, onClose, onSave }: ConfigPanelProps) {
  const componentInfo = node ? getComponentByType(node.data.componentType) : null;
  const { handleSubmit, control, reset, formState: { isDirty } } = useForm();

  useEffect(() => {
    if (node && componentInfo) {
      const defaultValues: Record<string, any> = {};
      componentInfo.params.forEach(param => {
        defaultValues[param.name] = node.data.params[param.name] ?? param.defaultValue;
      });
      reset(defaultValues);
    }
  }, [node, componentInfo, reset]);

  const onSubmit = (data: Record<string, any>) => {
    if (node) {
      onSave(node.id, data);
    }
    onClose();
  };
  
  const renderField = (param: Param) => {
    return (
        <Controller
            key={param.name}
            name={param.name}
            control={control}
            defaultValue={param.defaultValue}
            render={({ field }) => (
                <div className="grid gap-2">
                    <Label htmlFor={param.name}>{param.label}</Label>
                    {param.type === 'textarea' ? (
                        <Textarea id={param.name} {...field} placeholder={`Enter ${param.label}`} rows={4} />
                    ) : param.type === 'number' ? (
                        <Input id={param.name} type="number" {...field} placeholder={`Enter ${param.label}`} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    ) : (
                        <Input id={param.name} {...field} placeholder={`Enter ${param.label}`} />
                    )}
                </div>
            )}
        />
    )
  }

  return (
    <Sheet open={!!node} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline">Configure: {componentInfo?.name}</SheetTitle>
          <SheetDescription>{componentInfo?.description}</SheetDescription>
        </SheetHeader>
        {componentInfo && componentInfo.params.length > 0 ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex-grow flex flex-col">
             <ScrollArea className="flex-grow pr-6 -mr-6">
                <div className="space-y-4 py-4">
                    {componentInfo.params.map(renderField)}
                </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty}>Save Changes</Button>
            </SheetFooter>
          </form>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-muted-foreground">No configurable parameters for this component.</p>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
