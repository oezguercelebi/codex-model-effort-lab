import React, { useState } from 'react';
import { Destination } from '../../types';
import { useTrip } from '../../context/TripContext';
import {
  Clock,
  MapPin,
  Heart,
  Scale,
  Sparkles,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Sun,
  Flame,
} from 'lucide-react';
import { DestinationDetailModal } from './DestinationDetailModal';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const {
    friends,
    currentFriend,
    votes,
    castVote,
    scores,
    leaderDestination,
    comparedDestinationIds,
    toggleCompare,
    calculateDestinationCostPerPerson,
    tripMeta,
  } = useTrip();

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const cost = calculateDestinationCostPerPerson(destination);
  const isCompared = comparedDestinationIds.includes(destination.id);
  const isLeader = leaderDestination.id === destination.id;
  const isWinner = tripMeta.winningDestinationId === destination.id;

  const scoreData = scores[destination.id] || {
    totalPoints: 0,
    firstPlaceVotes: 0,
    secondPlaceVotes: 0,
    thirdPlaceVotes: 0,
    groupMatchPercentage: 80,
    voterIds: [],
  };

  const currentVote = votes[currentFriend.id];
  const isVotedRank1 = currentVote?.rank1 === destination.id;
  const isVotedRank2 = currentVote?.rank2 === destination.id;
  const isVotedRank3 = currentVote?.rank3 === destination.id;

  // Find all friends who voted for this destination
  const votersForThisDest = friends.filter((f) => {
    const v = votes[f.id];
    return v && (v.rank1 === destination.id || v.rank2 === destination.id || v.rank3 === destination.id);
  });

  const handleQuickVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Rank as #1
    castVote(destination.id, currentVote?.rank2 === destination.id ? undefined : currentVote?.rank2, currentVote?.rank3 === destination.id ? undefined : currentVote?.rank3);
  };

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
          isWinner
            ? 'border-emerald-500 ring-2 ring-emerald-500/30'
            : isLeader
            ? 'border-amber-400/80 shadow-md'
            : 'border-stone-200/90 shadow-xs'
        }`}
      >
        {/* Cover Image & Badges */}
        <div className="relative h-56 w-full overflow-hidden bg-stone-100">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5 items-center">
              {destination.featuredBadge && (
                <span className="rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-xs">
                  {destination.featuredBadge}
                </span>
              )}
              {isWinner && (
                <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm flex items-center">
                  <Sparkles className="mr-1 h-3 w-3" /> Winning Choice
                </span>
              )}
              {isLeader && !isWinner && (
                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-stone-950 shadow-sm flex items-center">
                  <Flame className="mr-1 h-3 w-3" /> Leader ({scoreData.totalPoints} pts)
                </span>
              )}
            </div>

            {/* Compare Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(destination.id);
              }}
              className={`flex items-center space-x-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-md transition-all ${
                isCompared
                  ? 'bg-emerald-600 text-white ring-2 ring-white shadow-md'
                  : 'bg-white/80 text-stone-800 hover:bg-white'
              }`}
            >
              <Scale className="h-3 w-3" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>

          {/* Bottom on-image info: Vibe & Location */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="text-white">
              <span className="text-[11px] font-medium tracking-wide text-stone-300 uppercase">
                {destination.stateOrRegion}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
                {destination.name}
              </h3>
            </div>
            <div className="rounded-xl bg-white/90 px-2.5 py-1 text-xs font-bold text-stone-900 backdrop-blur-md shadow-xs flex items-center">
              <Sun className="mr-1 h-3.5 w-3.5 text-amber-600" />
              <span>{destination.avgTemperature.split('/')[0]}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5">
          {/* Tagline */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {destination.tagline}
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 rounded-2xl bg-stone-50 p-3 border border-stone-100 mb-4">
            {/* Expected Budget */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Est. Per Person
              </span>
              <div className="mt-0.5 flex items-baseline space-x-1">
                <span className="text-base font-extrabold text-stone-900">
                  ${cost.totalPerPerson}
                </span>
                <span className="text-[11px] font-medium text-stone-500">/ 2 nights</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                ${destination.costBreakdown.lodgingPerNight}/nt cabin
              </p>
            </div>

            {/* Travel Time */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Travel Time
              </span>
              <div className="mt-0.5 flex items-center space-x-1 text-stone-900">
                <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold">{destination.driveTimeHours}h drive</span>
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                {destination.distanceMiles} miles from SF
              </p>
            </div>
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {destination.vibe.map((v) => (
              <span
                key={v}
                className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700"
              >
                {v}
              </span>
            ))}
          </div>

          {/* Group Match & Voters Bar */}
          <div className="mt-auto pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-700 flex items-center">
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                {scoreData.groupMatchPercentage}% Group Match
              </span>
              <span className="font-bold text-stone-900">
                {scoreData.totalPoints} pts ({scoreData.totalVoters} votes)
              </span>
            </div>

            {/* Mini Progress meter */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  scoreData.groupMatchPercentage >= 85
                    ? 'bg-emerald-500'
                    : scoreData.groupMatchPercentage >= 70
                    ? 'bg-teal-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${scoreData.groupMatchPercentage}%` }}
              />
            </div>

            {/* Voters Avatars */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2 overflow-hidden">
                {votersForThisDest.length > 0 ? (
                  votersForThisDest.map((voter) => {
                    const v = votes[voter.id];
                    const isRank1 = v?.rank1 === destination.id;
                    return (
                      <div key={voter.id} className="relative group/avatar">
                        <img
                          src={voter.avatar}
                          alt={voter.name}
                          className={`inline-block h-6 w-6 rounded-full ring-2 ${
                            isRank1 ? 'ring-emerald-500' : 'ring-white'
                          } object-cover`}
                          title={`${voter.name} ${isRank1 ? '(Rank #1)' : ''}`}
                        />
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[11px] text-stone-600 italic">No votes yet</span>
                )}
              </div>

              {/* Vote CTA for active friend */}
              <button
                onClick={handleQuickVote}
                className={`flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isVotedRank1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isVotedRank2 || isVotedRank3
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    isVotedRank1 ? 'fill-white text-white' : 'text-stone-500'
                  }`}
                />
                <span>
                  {isVotedRank1
                    ? '#1 Pick'
                    : isVotedRank2
                    ? '#2 Pick'
                    : isVotedRank3
                    ? '#3 Pick'
                    : 'Vote #1'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isDetailOpen && (
        <DestinationDetailModal
          destination={destination}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
};
