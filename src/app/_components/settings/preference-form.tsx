// components/settings/preference-form.tsx
'use client';

import { usePreferences } from '@/contexts/preferences-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const preferenceSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.enum(['english', 'spanish', 'indonesia']),
  notifications: z.boolean(),
});

type PreferenceFormValues = z.infer<typeof preferenceSchema>;

export function PreferenceForm() {
  const { preferences, isLoading, updateTheme, updateLanguage, updateNotifications } = usePreferences();

  const form = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      theme: 'light',
      language: 'english',
      notifications: true,
    },
  });

  // Update form values when preferences change
  useEffect(() => {
    if (preferences) {
      form.reset({
        theme: preferences.theme,
        language: preferences.language,
        notifications: preferences.notifications,
      });
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferenceFormValues) => {
    try {
      if (data.theme !== preferences?.theme) {
        await updateTheme(data.theme);
      }
      
      if (data.language !== preferences?.language) {
        await updateLanguage(data.language);
      }
      
      if (data.notifications !== preferences?.notifications) {
        await updateNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>Customize your experience by adjusting your preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateTheme(value as 'light' | 'dark');
                      }}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="light" />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Light</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="dark" />
                        </FormControl>
                        <FormLabel className="cursor-pointer">Dark</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choose between light and dark mode for the interface.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      updateLanguage(value as 'english' | 'spanish' | 'indonesia');
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="indonesia">Indonesia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred language for the interface.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications about updates and activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        updateNotifications(checked);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Save Preferences</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}