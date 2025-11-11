'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditIcon, EyeIcon, SearchIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { deleteRoom } from '@/actions/room.actions';
import { toast } from 'sonner';
import { RoomStatus, RoomType } from '@/types';

interface Room {
  id: string;
  name: string;
  type: RoomType;
  roomNumber: string;
  price: any;
  capacity: number;
  status: RoomStatus;
  floor: number | null;
}

interface RoomsTableProps {
  rooms: Room[];
}

export function RoomsTable({ rooms }: RoomsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('query') || ''
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    startTransition(() => {
      router.push(`/admin/rooms?${params.toString()}`);
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/admin/rooms?${params.toString()}`);
    });
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;

    setIsDeleting(true);
    const result = await deleteRoom(roomToDelete.id);

    if (result.success) {
      toast.success('Room deleted successfully');
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete room');
    }
    setIsDeleting(false);
  };

  const getStatusBadge = (status: RoomStatus) => {
    const variants: Record<
      RoomStatus,
      'default' | 'secondary' | 'destructive'
    > = {
      AVAILABLE: 'default',
      OCCUPIED: 'secondary',
      MAINTENANCE: 'destructive',
    };

    const labels: Record<RoomStatus, string> = {
      AVAILABLE: 'Available',
      OCCUPIED: 'Occupied',
      MAINTENANCE: 'Maintenance',
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getRoomTypeLabel = (type: RoomType) => {
    const labels: Record<RoomType, string> = {
      SINGLE: 'Single',
      DOUBLE: 'Double',
      SUITE: 'Suite',
      DELUXE: 'Deluxe',
      PRESIDENTIAL: 'Presidential',
    };
    return labels[type];
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, room number..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={searchParams.get('type') || 'all'}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="DOUBLE">Double</SelectItem>
              <SelectItem value="SUITE">Suite</SelectItem>
              <SelectItem value="DELUXE">Deluxe</SelectItem>
              <SelectItem value="PRESIDENTIAL">Presidential</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={searchParams.get('status') || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="OCCUPIED">Occupied</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Room Number</TableHead>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[120px]">Type</TableHead>
              <TableHead className="min-w-[80px]">Floor</TableHead>
              <TableHead className="min-w-[90px]">Capacity</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[120px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground"
                >
                  No rooms found
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">
                    {room.roomNumber}
                  </TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{getRoomTypeLabel(room.type)}</TableCell>
                  <TableCell>{room.floor ?? 'N/A'}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>₦{Number(room.price).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(room.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="View details"
                      >
                        <Link href={`/admin/rooms/${room.id}`}>
                          <EyeIcon />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        title="Edit room"
                      >
                        <Link href={`/admin/rooms/${room.id}/edit`}>
                          <EditIcon />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setRoomToDelete(room);
                          setDeleteDialogOpen(true);
                        }}
                        title="Delete room"
                      >
                        <TrashIcon className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {rooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No rooms found
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    Room {room.roomNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">{room.name}</p>
                </div>
                {getStatusBadge(room.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">
                    {getRoomTypeLabel(room.type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Floor:</span>
                  <span>{room.floor ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">
                    ₦{Number(room.price).toLocaleString()}/night
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/rooms/${room.id}`}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/rooms/${room.id}/edit`}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRoomToDelete(room);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <TrashIcon className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete room {roomToDelete?.roomNumber} -{' '}
              {roomToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
