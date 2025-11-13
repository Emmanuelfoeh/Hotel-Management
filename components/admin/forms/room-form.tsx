'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createRoomSchema } from '@/lib/validations/room';
import { createRoom, updateRoom } from '@/actions/room.actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { XIcon } from 'lucide-react';
import { RoomStatus, RoomType } from '@/types';
import { z } from 'zod';
import { ImageUpload } from '@/components/shared';

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'TV',
  'Mini Bar',
  'Safe',
  'Telephone',
  'Room Service',
  'Balcony',
  'Ocean View',
  'City View',
  'Bathtub',
  'Shower',
  'Hair Dryer',
  'Iron',
  'Coffee Maker',
];

interface RoomFormProps {
  room?: {
    id: string;
    name: string;
    type: RoomType;
    description: string | null;
    price: number;
    capacity: number;
    amenities: string[];
    images: string[];
    status: RoomStatus;
    floor: number | null;
    roomNumber: string;
  };
  mode: 'create' | 'edit';
}

type FormData = z.infer<typeof createRoomSchema>;

export function RoomForm({ room, mode }: RoomFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: room?.name || '',
      type: room?.type || 'SINGLE',
      description: room?.description || '',
      price: room ? Number(room.price) : 0,
      capacity: room?.capacity || 1,
      amenities: room?.amenities || [],
      images: room?.images || [],
      status: room?.status || 'AVAILABLE',
      floor: room?.floor || null,
      roomNumber: room?.roomNumber || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Ensure price is a number and floor is undefined if null
      const submitData = {
        ...data,
        price:
          typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        floor: data.floor === null ? undefined : data.floor,
      };

      const result =
        mode === 'create'
          ? await createRoom(submitData)
          : await updateRoom(room!.id, submitData);

      if (result.success) {
        toast.success(
          mode === 'create'
            ? 'Room created successfully'
            : 'Room updated successfully'
        );
        router.push('/admin/rooms');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save room');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAmenity = (amenity: string) => {
    const currentAmenities = form.getValues('amenities');
    if (!currentAmenities.includes(amenity)) {
      form.setValue('amenities', [...currentAmenities, amenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    const currentAmenities = form.getValues('amenities');
    form.setValue(
      'amenities',
      currentAmenities.filter((a) => a !== amenity)
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim()) {
      addAmenity(customAmenity.trim());
      setCustomAmenity('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Deluxe Ocean View" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="DOUBLE">Double</SelectItem>
                        <SelectItem value="SUITE">Suite</SelectItem>
                        <SelectItem value="DELUXE">Deluxe</SelectItem>
                        <SelectItem value="PRESIDENTIAL">
                          Presidential
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Night (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OCCUPIED">Occupied</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the room features and amenities..."
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Amenities</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_AMENITIES.map((amenity) => (
                      <Button
                        key={amenity}
                        type="button"
                        variant={
                          field.value.includes(amenity) ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => {
                          if (field.value.includes(amenity)) {
                            removeAmenity(amenity);
                          } else {
                            addAmenity(amenity);
                          }
                        }}
                      >
                        {amenity}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Input
                placeholder="Add custom amenity"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
              />
              <Button type="button" onClick={addCustomAmenity}>
                Add
              </Button>
            </div>

            {form.watch('amenities').length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Selected Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {form.watch('amenities').map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 hover:text-primary-foreground/80"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Images</FormLabel>
                  <FormDescription>
                    Upload images for the room. You can upload up to 10 images.
                    The first image will be used as the primary image.
                  </FormDescription>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxFiles={10}
                      disabled={isSubmitting}
                      endpoint="roomImage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Room'
                : 'Update Room'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
