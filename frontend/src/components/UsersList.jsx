import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatContext } from "stream-chat-react";
import * as Sentry from "@sentry/react";
import { CircleIcon } from "lucide-react";

const UsersList = ({ activeChannel }) => {
  const { client } = useChatContext();
  const [_, setSearchParams] = useSearchParams();

  const fetchUsers = useCallback(async () => {
    if (!client?.user) return [];

    const response = await client.queryUsers(
      { id: { $ne: client.user.id } },
      { name: 1 },
      { limit: 20 }
    );

    return response.users.filter((u) => !u.id.startsWith("recording-"));
  }, [client]);

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users-list", client?.user?.id],
    queryFn: fetchUsers,
    enabled: !!client?.user,
    staleTime: 1000 * 60 * 5,
  });

  // ------------------------------------------------------
  // 1. BUILD DM CHANNEL OBJECTS (STABLE, OUTSIDE RENDER)
  // ------------------------------------------------------
  const dmChannels = useMemo(() => {
    if (!users.length || !client?.user) return {};

    const map = {};
    for (const user of users) {
      const channelId = [client.user.id, user.id]
        .sort()
        .join("-")
        .slice(0, 64);

      map[user.id] = client.channel("messaging", channelId, {
        members: [client.user.id, user.id],
      });
    }
    return map;
  }, [users, client]);

  // ------------------------------------------------------
  // 2. WATCH ALL DM CHANNELS EXACTLY ONCE
  // ------------------------------------------------------
  useEffect(() => {
    const channels = Object.values(dmChannels);
    if (channels.length === 0) return;

    channels.forEach((ch) => {
      ch.watch().catch((err) => {
        console.error("DM channel watch failed", err);
      });
    });
  }, [dmChannels]);

  // ------------------------------------------------------
  // 3. START DM
  // ------------------------------------------------------
  const startDirectMessage = async (targetUser) => {
    const channel = dmChannels[targetUser.id];
    if (!channel) return;

    try {
      await channel.watch();
      setSearchParams({ channel: channel.id });
    } catch (err) {
      console.error("Error creating DM", err);
      Sentry.captureException(err, {
        tags: { component: "UsersList" },
        extra: { targetUserId: targetUser?.id },
      });
    }
  };

  if (isLoading) return <div className="team-channel-list__message">Loading users...</div>;
  if (isError) return <div className="team-channel-list__message">Failed to load users</div>;
  if (!users.length) return <div className="team-channel-list__message">No other users found</div>;

  // ------------------------------------------------------
  // 4. RENDER LIST (NO CHANNEL CREATION HERE)
  // ------------------------------------------------------
  return (
    <div className="team-channel-list__users">
      {users.map((user) => {
        const channel = dmChannels[user.id];
        const unread = channel?.countUnread() || 0;
        const isActive = activeChannel?.id === channel?.id;

        return (
          <button
            key={user.id}
            onClick={() => startDirectMessage(user)}
            className={`str-chat__channel-preview-messenger ${
              isActive && "bg-black/20! border-l-8 border-purple-500 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-2 w-full">

              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.id}
                    className="w-4 h-4 rounded-full"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs text-white">
                      {(user.name || user.id)[0].toUpperCase()}
                    </span>
                  </div>
                )}

                <CircleIcon
                  className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 ${
                    user.online
                      ? "text-green-500 fill-green-500"
                      : "text-gray-400 fill-gray-400"
                  }`}
                />
              </div>

              <span className="truncate">{user.name || user.id}</span>

              {unread > 0 && (
                <span className="flex items-center justify-center ml-2 size-4 text-xs rounded-full bg-red-500">
                  {unread}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default UsersList;
