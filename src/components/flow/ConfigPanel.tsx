"use client";

import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
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
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

type ConfigPanelProps = {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, data: any) => void;
};

export function ConfigPanel({ node, onClose, onSave }: ConfigPanelProps) {
  const componentInfo = node ? getComponentByType(node.data.componentType) : null;
  const { handleSubmit, control, reset, formState: { isDirty, errors }, register } = useForm();
  
  const watchedOptionalFields = useWatch({ control, name: componentInfo?.params.filter(p => p.optional).map(p => `${p.name}__active`) || [] });

  useEffect(() => {
    if (node && componentInfo) {
      const defaultValues: Record<string, any> = {};
      componentInfo.params.forEach(param => {
        const paramValue = node.data.params[param.name];
        if (param.optional) {
          const isActive = paramValue !== undefined;
          defaultValues[`${param.name}__active`] = isActive;
          defaultValues[param.name] = isActive ? paramValue : param.defaultValue;
        } else {
          defaultValues[param.name] = paramValue ?? param.defaultValue;
        }
      });
      reset(defaultValues);
    }
  }, [node, componentInfo, reset]);

  const onSubmit = (data: Record<string, any>) => {
    if (node && componentInfo) {
      const finalData: Record<string, any> = {};
      componentInfo.params.forEach(param => {
        if(param.optional) {
          if (data[`${param.name}__active`]) {
            finalData[param.name] = data[param.name];
          }
        } else {
          finalData[param.name] = data[param.name];
        }
      });
      onSave(node.id, finalData);
    }
    onClose();
  };
  
  const renderField = (param: Param, index: number) => {
    const fieldName = param.name;
    const isOptionalActive = param.optional ? watchedOptionalFields[index] : false;

    return (
        <div key={param.name} className="space-y-2">
            {param.optional && (
                <div className="flex items-center space-x-2">
                    <Controller
                        name={`${param.name}__active`}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                           <Checkbox
                             id={`${param.name}__active`}
                             checked={field.value}
                             onCheckedChange={field.onChange}
                           />
                        )}
                    />
                    <Label htmlFor={`${param.name}__active`} className="font-normal">
                        Enable {param.label}
                    </Label>
                </div>
            )}
            <div className={cn("grid gap-2", (param.optional && !isOptionalActive) && "hidden")}>
                <Label htmlFor={param.name}>
                    {param.label}
                    {param.required && <span className="text-destructive">*</span>}
                </Label>
                <Controller
                    name={param.name}
                    control={control}
                    defaultValue={param.defaultValue}
                    rules={{ required: param.required ? `${param.label} is required` : false }}
                    render={({ field }) => (
                       <>
                         {param.type === 'textarea' ? (
                            <Textarea id={param.name} {...field} placeholder={`Enter ${param.label}`} rows={4} />
                        ) : param.type === 'number' ? (
                            <Input id={param.name} type="number" {...field} placeholder={`Enter ${param.label}`} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                        ) : (
                            <Input id={param.name} {...field} placeholder={`Enter ${param.label}`} />
                        )}
                       </>
                    )}
                />
                 {errors[param.name] && <p className="text-sm text-destructive">{errors[param.name]?.message as string}</p>}
            </div>
        </div>
    )
  }

  const optionalParamStartIndex = componentInfo?.params.findIndex(p => p.optional) ?? -1;


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
                    {componentInfo.params.map((param, index) => renderField(param, param.optional ? index - optionalParamStartIndex : -1))}
                </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty && Object.keys(errors).length === 0}>Save Changes</Button>
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
