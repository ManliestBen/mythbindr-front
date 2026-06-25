import { useEffect, useState } from 'react';
import { getSocket } from './socket';

export interface Participant {
  userId: string;
  displayName: string;
}

/** Join an element's realtime room and track who else is here. */
export function usePresence(elementId: string | undefined): Participant[] {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!elementId || elementId === 'new') return;
    const socket = getSocket();

    const onPresence = (data: { participants: Participant[] }) =>
      setParticipants(data.participants);
    const join = () => socket.emit('element:join', { elementId });

    socket.on('presence', onPresence);
    socket.on('connect', join);
    if (socket.connected) join();

    return () => {
      socket.emit('element:leave', { elementId });
      socket.off('presence', onPresence);
      socket.off('connect', join);
      setParticipants([]);
    };
  }, [elementId]);

  return participants;
}
