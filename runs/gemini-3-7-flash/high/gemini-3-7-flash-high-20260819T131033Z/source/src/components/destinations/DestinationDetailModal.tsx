import React, { useState } from 'react';
import { Destination } from '../../types';
import { useTrip } from '../../context/TripContext';
import {
  X,
  Clock,
  MapPin,
  DollarSign,
  Heart,
  Sparkles,
  CheckCircle,
  XCircle,
  Bed,
  Users,
  Sun,
  Send,
  MessageSquare,
  Scale,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination;
  onClose: () => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
}) => {
  const {
    friends,
    currentFriend,
    votes,
    castVote,
    scores,
    comments,
    addComment,
    calculateDestinationCostPerPerson,
    setWinningDestinationId,
    tripMeta,
    setActiveTab,
    setSelectedDestinationForItinerary,
  } = useTrip();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [nights, setNights] = useState(2);
  const [headcount, setHeadcount] = useState(6);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');

  const allImages = [destination.heroImage, ...(destination.galleryImages || [])];
  const cost = calculateDestinationCostPerPerson(destination, nights, headcount);
  const scoreData = scores[destination.id] || {
    totalPoints: 0,
    firstPlaceVotes: 0,
    secondPlaceVotes: 0,
    thirdPlaceVotes: 0,
    groupMatchPercentage: 85,
    voterIds: [],
  };

  const currentVote = votes[currentFriend.id];
  const isRank1 = currentVote?.rank1 === destination.id;
  const isRank2 = currentVote?.rank2 === destination.id;
  const isRank3 = currentVote?.rank3 === destination.id;
  const isWinner = tripMeta.winningDestinationId === destination.id;

  const destComments = comments.filter((c) => c.destinationId === destination.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(destination.id, newCommentText, selectedEmoji);
    setNewCommentText('');
  };

  const handleSetWinner = () => {
    setWinningDestinationId(destination.id);
    setSelectedDestinationForItinerary(destination.id);
  };

  const handleGoToItinerary = () => {
    setSelectedDestinationForItinerary(destination.id);
    setActiveTab('itinerary');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all max-h-[92vh] flex flex-col">
        {/* Modal Header Bar with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-100 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {destination.stateOrRegion}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 truncate">
              {destination.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8">
          {/* Photo Gallery & Hero */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl bg-stone-100">
              <img
                src={allImages[activeImageIndex]}
                alt={destination.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="rounded-full bg-stone-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {destination.vibe.join(' · ')}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 rounded-xl bg-stone-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                Photo {activeImageIndex + 1} of {allImages.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Bar: Voting & Winner Selection */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-900 p-4 text-white">
            <div>
              <span className="text-xs text-stone-400 font-medium">Group Consensus</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-lg font-bold">{scoreData.totalPoints} Total Points</span>
                <span className="text-xs text-stone-400">({scoreData.groupMatchPercentage}% group match)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-stone-800 rounded-xl p-1">
                <button
                  onClick={() => castVote(destination.id, currentVote?.rank2, currentVote?.rank3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isRank1 ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {isRank1 ? '✓ Rank #1' : 'Set as #1 Pick'}
                </button>
                <button
                  onClick={() => castVote(currentVote?.rank1 || destination.id, destination.id, currentVote?.rank3)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isRank2 ? 'bg-emerald-700 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  #2
                </button>
                <button
                  onClick={() => castVote(currentVote?.rank1 || destination.id, currentVote?.rank2, destination.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isRank3 ? 'bg-emerald-800 text-white' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  #3
                </button>
              </div>

              <button
                onClick={handleSetWinner}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                  isWinner
                    ? 'bg-emerald-500 text-stone-950 font-extrabold'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isWinner ? 'Official Winner' : 'Set as Winning Destination'}</span>
              </button>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-stone-900">About this Getaway</h3>
            <p className="text-sm leading-relaxed text-stone-700">{destination.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Drive Distance
                </span>
                <p className="text-sm font-bold text-stone-900 mt-1">
                  {destination.distanceMiles} miles
                </p>
                <p className="text-[11px] text-stone-500">{destination.driveTimeHours}h scenic drive</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Weather & Vibe
                </span>
                <p className="text-sm font-bold text-stone-900 mt-1">
                  {destination.avgTemperature}
                </p>
                <p className="text-[11px] text-stone-500">{destination.weatherCondition}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Budget Tier
                </span>
                <p className="text-sm font-bold text-stone-900 mt-1">
                  {destination.budgetTier} (${cost.totalPerPerson}/person)
                </p>
                <p className="text-[11px] text-stone-500">2-night estimate</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-3 border border-stone-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Transport Type
                </span>
                <p className="text-sm font-bold text-stone-900 mt-1">
                  {destination.transportType}
                </p>
                <p className="text-[11px] text-stone-500">From Bay Area Hub</p>
              </div>
            </div>
          </div>

          {/* Interactive Cost Breakdown & Splitter */}
          <div className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center">
                  <DollarSign className="mr-1.5 h-4 w-4 text-emerald-600" />
                  Estimated Trip Cost Breakdown
                </h3>
                <p className="text-xs text-stone-500">
                  Adjust group size and stay duration to see dynamic cost per person
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500">Nights:</span>
                  <button
                    onClick={() => setNights(2)}
                    className={`px-2 py-0.5 rounded-md ${
                      nights === 2 ? 'bg-emerald-600 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    2
                  </button>
                  <button
                    onClick={() => setNights(3)}
                    className={`px-2 py-0.5 rounded-md ${
                      nights === 3 ? 'bg-emerald-600 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    3
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500">Friends:</span>
                  {[4, 6, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => setHeadcount(num)}
                      className={`px-2 py-0.5 rounded-md ${
                        headcount === num
                          ? 'bg-emerald-600 text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white p-3 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Lodging Split</span>
                <p className="text-base font-extrabold text-stone-900 mt-1">${cost.lodgingShare}</p>
                <p className="text-[10px] text-stone-500">
                  ${destination.costBreakdown.lodgingPerNight} × {nights}nt / {headcount} ppl
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Travel & Gas</span>
                <p className="text-base font-extrabold text-stone-900 mt-1">${cost.travelShare}</p>
                <p className="text-[10px] text-stone-500">Carpool fuel & tolls</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Food & Drinks</span>
                <p className="text-base font-extrabold text-stone-900 mt-1">${cost.foodShare}</p>
                <p className="text-[10px] text-stone-500">
                  ${destination.costBreakdown.foodAndDrinksPerDay}/day × {nights}d
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-500 uppercase">Activities</span>
                <p className="text-base font-extrabold text-stone-900 mt-1">${cost.activitiesShare}</p>
                <p className="text-[10px] text-stone-500">Passes & gear rentals</p>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald-950 p-4 text-white">
              <div>
                <span className="text-xs text-emerald-300 font-medium">
                  Total Expected Cost Per Friend
                </span>
                <p className="text-2xl font-black text-white">${cost.totalPerPerson}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-300 font-medium">Total Group Total</span>
                <p className="text-lg font-bold text-white">${cost.totalForGroup}</p>
              </div>
            </div>
          </div>

          {/* Lodging Showcase */}
          {destination.lodgingOptions && destination.lodgingOptions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center">
                <Bed className="mr-2 h-4 w-4 text-emerald-600" />
                Featured Group Lodging Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.lodgingOptions.map((lodge, i) => (
                  <div
                    key={i}
                    className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs"
                  >
                    <div className="h-40 w-full overflow-hidden bg-stone-100">
                      <img
                        src={lodge.imageUrl}
                        alt={lodge.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-700">{lodge.type}</span>
                          <span className="text-xs font-bold text-stone-900">⭐ {lodge.rating}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1">{lodge.name}</h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {lodge.bedrooms} Bedrooms · {lodge.bathrooms} Bathrooms
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {lodge.perks.map((p, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-500">Price per night:</span>
                        <span className="text-sm font-bold text-stone-900">
                          ${lodge.pricePerNight} / night
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center">
                <CheckCircle className="mr-1.5 h-4 w-4 text-emerald-600" />
                Why it’s great for the group
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {destination.pros.map((pro, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-emerald-600 font-bold">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center">
                <XCircle className="mr-1.5 h-4 w-4 text-amber-600" />
                Things to keep in mind
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {destination.cons.map((con, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-amber-600 font-bold">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sample Itinerary Preview */}
          <div className="space-y-3 rounded-2xl bg-stone-50 p-4 border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Sample 3-Day Weekend Schedule</h3>
              <button
                onClick={handleGoToItinerary}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center cursor-pointer"
              >
                <span>Full Interactive Itinerary</span>
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </button>
            </div>
            <div className="space-y-2">
              {destination.sampleItinerary.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80 text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 font-bold text-stone-700 text-[10px]">
                      {item.day} {item.time}
                    </span>
                    <span className="font-semibold text-stone-900">{item.title}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Discussion & Friend Notes */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" />
              Friend Comments & Discussion ({destComments.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-2.5">
              {destComments.length > 0 ? (
                destComments.map((comm) => {
                  const author = friends.find((f) => f.id === comm.friendId);
                  return (
                    <div
                      key={comm.id}
                      className="flex items-start space-x-3 rounded-2xl bg-stone-50 p-3 border border-stone-100"
                    >
                      <img
                        src={author?.avatar}
                        alt={author?.name}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">{author?.name}</span>
                          <span className="text-base">{comm.reaction}</span>
                        </div>
                        <p className="text-xs text-stone-700 mt-1">{comm.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-500 italic p-3 text-center bg-stone-50 rounded-2xl">
                  No comments yet on this destination. Be the first to share your thoughts!
                </p>
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="flex flex-col space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-stone-500">Posting as:</span>
                <span className="text-xs font-bold text-stone-900">{currentFriend.name}</span>
                <div className="flex items-center space-x-1 ml-auto">
                  {['🔥', '🍷', '🌲', '🛶', '🥂', '🌊'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-sm px-1.5 py-0.5 rounded-lg ${
                        selectedEmoji === emoji ? 'bg-emerald-100 ring-1 ring-emerald-500' : 'hover:bg-stone-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Add a note or suggestion about ${destination.name.split(' ')[0]}...`}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40 flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleGoToItinerary}
            className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition cursor-pointer flex items-center space-x-1.5"
          >
            <span>Open Destination Itinerary</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
