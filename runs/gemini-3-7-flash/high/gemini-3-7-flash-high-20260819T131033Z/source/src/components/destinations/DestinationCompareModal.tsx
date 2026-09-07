import React from 'react';
import { useTrip } from '../../context/TripContext';
import {
  X,
  Scale,
  Clock,
  DollarSign,
  TrendingUp,
  Heart,
  Sparkles,
  CheckCircle,
  XCircle,
  Sun,
  Plus,
} from 'lucide-react';

interface DestinationCompareModalProps {
  onClose?: () => void;
}

export const DestinationCompareModal: React.FC<DestinationCompareModalProps> = ({ onClose }) => {
  const {
    destinations,
    comparedDestinationIds,
    toggleCompare,
    clearCompare,
    scores,
    calculateDestinationCostPerPerson,
    castVote,
    votes,
    currentFriend,
    tripMeta,
    setWinningDestinationId,
  } = useTrip();

  // If comparedDestinationIds is empty, show default top 3 destinations
  const compareList = (
    comparedDestinationIds.length >= 2
      ? destinations.filter((d) => comparedDestinationIds.includes(d.id))
      : destinations.slice(0, 3)
  );

  const currentVote = votes[currentFriend.id];

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-100 p-2 text-emerald-700">
              <Scale className="h-5 w-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Side-by-Side Getaway Comparison
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Compare travel times, estimated budget, vibes, pros & cons to find the best fit for all {destinations.length > 0 ? 6 : 0} friends.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {comparedDestinationIds.length > 0 && (
            <button
              onClick={clearCompare}
              className="rounded-xl border border-stone-300 px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            >
              Reset Selection
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition cursor-pointer"
            >
              Back to Explore
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table / Matrix */}
      <div className="overflow-x-auto pb-4">
        <div
          className="grid gap-4 min-w-[750px]"
          style={{
            gridTemplateColumns: `repeat(${compareList.length}, minmax(240px, 1fr))`,
          }}
        >
          {compareList.map((dest) => {
            const cost = calculateDestinationCostPerPerson(dest);
            const scoreData = scores[dest.id] || {
              totalPoints: 0,
              firstPlaceVotes: 0,
              secondPlaceVotes: 0,
              thirdPlaceVotes: 0,
              groupMatchPercentage: 80,
              voterIds: [],
            };
            const isRank1 = currentVote?.rank1 === dest.id;
            const isWinner = tripMeta.winningDestinationId === dest.id;

            return (
              <div
                key={dest.id}
                className={`flex flex-col rounded-3xl bg-white border p-4 transition-all shadow-xs ${
                  isWinner
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : isRank1
                    ? 'border-emerald-300'
                    : 'border-stone-200'
                }`}
              >
                {/* Header Card / Image */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-stone-100 mb-3">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                  <button
                    onClick={() => toggleCompare(dest.id)}
                    className="absolute top-2.5 right-2.5 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition"
                    title="Remove from comparison"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] uppercase font-bold text-stone-300">
                      {dest.stateOrRegion}
                    </span>
                    <h3 className="text-base font-bold leading-snug">{dest.name}</h3>
                  </div>
                </div>

                {/* Voting / Action */}
                <div className="mb-4 flex flex-col space-y-2">
                  <button
                    onClick={() => castVote(dest.id, currentVote?.rank2, currentVote?.rank3)}
                    className={`w-full rounded-xl py-2 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                      isRank1
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${isRank1 ? 'fill-white text-white' : 'text-stone-500'}`}
                    />
                    <span>{isRank1 ? 'Your #1 Pick' : 'Vote #1 for this spot'}</span>
                  </button>

                  <button
                    onClick={() => setWinningDestinationId(dest.id)}
                    className={`w-full rounded-xl py-1.5 text-[11px] font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
                      isWinner
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    <span>{isWinner ? 'Selected Winner' : 'Set as Winning Destination'}</span>
                  </button>
                </div>

                {/* Metrics Stack */}
                <div className="space-y-3.5 text-xs flex-1">
                  {/* Total Est Cost */}
                  <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      Est. Per Person (2 Nights)
                    </span>
                    <div className="flex items-baseline space-x-1 mt-0.5">
                      <span className="text-lg font-black text-stone-900">
                        ${cost.totalPerPerson}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        (${cost.totalForGroup} group total)
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-[11px] text-stone-600 border-t border-stone-200/60 pt-1.5">
                      <div className="flex justify-between">
                        <span>Lodging Share:</span>
                        <span className="font-semibold text-stone-900">${cost.lodgingShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travel & Gas:</span>
                        <span className="font-semibold text-stone-900">${cost.travelShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food & Drinks:</span>
                        <span className="font-semibold text-stone-900">${cost.foodShare}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activities:</span>
                        <span className="font-semibold text-stone-900">${cost.activitiesShare}</span>
                      </div>
                    </div>
                  </div>

                  {/* Travel Time & Route */}
                  <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      Travel Time from Bay Area
                    </span>
                    <p className="text-sm font-bold text-stone-900 mt-0.5 flex items-center">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                      {dest.driveTimeHours}h ({dest.distanceMiles} miles)
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">{dest.transportType}</p>
                  </div>

                  {/* Group Compatibility */}
                  <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500">
                        Group Compatibility
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {scoreData.groupMatchPercentage}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 mb-2">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${scoreData.groupMatchPercentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium">
                      Leader Score: <strong>{scoreData.totalPoints} pts</strong> ({scoreData.firstPlaceVotes} 1st-place votes)
                    </p>
                  </div>

                  {/* Weather */}
                  <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500">
                        Expected Weather
                      </span>
                      <p className="text-xs font-bold text-stone-900 mt-0.5">{dest.avgTemperature}</p>
                    </div>
                    <span className="text-sm">{dest.weatherCondition}</span>
                  </div>

                  {/* Vibe Tags */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">Vibes</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dest.vibe.map((v) => (
                        <span
                          key={v}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">
                      Top Highlights
                    </span>
                    <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                      {dest.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-1.5 text-emerald-600 font-bold">•</span>
                          <span className="line-clamp-2">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100">
                      <span className="text-[10px] uppercase font-bold text-emerald-900 flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3 text-emerald-600" />
                        Top Pro
                      </span>
                      <p className="text-[11px] text-emerald-950 mt-0.5">{dest.pros[0]}</p>
                    </div>

                    <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-100">
                      <span className="text-[10px] uppercase font-bold text-amber-900 flex items-center">
                        <XCircle className="mr-1 h-3 w-3 text-amber-600" />
                        Key Consideration
                      </span>
                      <p className="text-[11px] text-amber-950 mt-0.5">{dest.cons[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
