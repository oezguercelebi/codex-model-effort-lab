import React from 'react';
import { useTrip, NavigationTab } from '../../context/TripContext';
import {
  Compass,
  Scale,
  Vote,
  CalendarCheck,
  Receipt,
  Luggage,
} from 'lucide-react';

interface TabItem {
  id: NavigationTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    destinations,
    comparedDestinationIds,
    votes,
    friends,
    winningDestination,
    tripMeta,
  } = useTrip();

  const totalVotedFriends = Object.keys(votes).length;

  const tabs: TabItem[] = [
    {
      id: 'destinations',
      label: 'Explore Getaways',
      shortLabel: 'Explore',
      icon: Compass,
      badge: destinations.length,
    },
    {
      id: 'compare',
      label: 'Compare Matrix',
      shortLabel: 'Compare',
      icon: Scale,
      badge: comparedDestinationIds.length > 0 ? `${comparedDestinationIds.length}` : undefined,
    },
    {
      id: 'voting',
      label: 'Group Voting',
      shortLabel: 'Voting',
      icon: Vote,
      badge: `${totalVotedFriends}/${friends.length}`,
      highlight: !tripMeta.isVotingLocked,
    },
    {
      id: 'itinerary',
      label: `Trip Itinerary (${winningDestination.name.split(' ')[0]})`,
      shortLabel: 'Itinerary',
      icon: CalendarCheck,
      highlight: tripMeta.isVotingLocked,
    },
    {
      id: 'budget',
      label: 'Budget & Splitter',
      shortLabel: 'Budget',
      icon: Receipt,
    },
    {
      id: 'essentials',
      label: 'Packing & Carpools',
      shortLabel: 'Essentials',
      icon: Luggage,
    },
  ];

  return (
    <div className="bg-stone-50 border-b border-stone-200 sticky top-[97px] sm:top-[98px] z-30 shadow-2xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/30'
                    : 'bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80 shadow-2xs'
                }`}
              >
                <Icon
                  className={`mr-2 h-4 w-4 transition-colors ${
                    isActive ? 'text-white' : 'text-stone-500 group-hover:text-emerald-700'
                  }`}
                />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
