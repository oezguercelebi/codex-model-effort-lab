import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Lock,
  LockOpen,
  RotateCcw,
  Sparkles,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { ShareModal } from '../modals/ShareModal';
import { EditTripModal } from '../modals/EditTripModal';

export const Header: React.FC = () => {
  const {
    friends,
    currentFriendId,
    currentFriend,
    setCurrentFriendId,
    tripMeta,
    toggleVotingLock,
    resetAllData,
    winningDestination,
  } = useTrip();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      {/* Top Banner / Trip Alert */}
      <div className="bg-stone-900 px-4 py-1.5 text-xs font-medium text-stone-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-semibold text-[11px] ring-1 ring-emerald-500/40">
              <Sparkles className="mr-1 h-3 w-3" />
              Collaborative Planning Active
            </span>
            <span className="hidden sm:inline text-stone-400">
              {tripMeta.isVotingLocked
                ? `Destination Decided: ${winningDestination.name} 🎉`
                : 'All 6 friends invited · Live voting open'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-stone-400">
            <button
              onClick={resetAllData}
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Reset state to initial realistic demo data"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
            <span className="hidden sm:inline">|</span>
            <span className="text-stone-300 font-mono text-[11px]">
              Origin: <strong className="text-white">{tripMeta.originCity}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Trip Info */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm ring-2 ring-emerald-600/20">
              <span className="text-xl font-black tracking-tight">W</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Weekender</span>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-stone-900 sm:text-lg truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {tripMeta.title}
                </h1>
                <button
                  onClick={() => setIsEditTripOpen(true)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                  title="Edit trip title & dates"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Tags */}
          <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-stone-200 text-xs text-stone-600">
            <span className="inline-flex items-center rounded-lg bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
              <Calendar className="mr-1.5 h-3.5 w-3.5 text-stone-500" />
              {tripMeta.dateRange}
            </span>
            <span className="inline-flex items-center rounded-lg bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-stone-500" />
              Departing: {tripMeta.originCity}
            </span>
            <span className="inline-flex items-center rounded-lg bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
              <Users className="mr-1.5 h-3.5 w-3.5 text-stone-500" />
              {friends.length} Friends
            </span>
          </div>
        </div>

        {/* Right side: Active Persona Switcher & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Persona Switcher Dropdown */}
          <div className="relative flex items-center bg-stone-100 hover:bg-stone-200/80 transition rounded-2xl p-1 pr-3 border border-stone-200">
            <img
              src={currentFriend.avatar}
              alt={currentFriend.name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-white shadow-xs mr-2"
            />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500 flex items-center">
                <span>Active Persona</span>
              </div>
              <select
                value={currentFriendId}
                onChange={(e) => setCurrentFriendId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-900 border-none outline-hidden cursor-pointer p-0"
              >
                {friends.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voting Lock Toggle */}
          <button
            onClick={toggleVotingLock}
            className={`hidden sm:inline-flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition shadow-xs ${
              tripMeta.isVotingLocked
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
            title={tripMeta.isVotingLocked ? 'Unlock voting for everyone' : 'Lock in current winning destination'}
          >
            {tripMeta.isVotingLocked ? (
              <>
                <Lock className="h-3.5 w-3.5 text-amber-700" />
                <span>Winner Locked</span>
              </>
            ) : (
              <>
                <LockOpen className="h-3.5 w-3.5 text-emerald-600" />
                <span>Voting Open</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-stone-800 transition active:scale-95"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Invite / Share</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {isShareOpen && <ShareModal onClose={() => setIsShareOpen(false)} />}
      {isEditTripOpen && <EditTripModal onClose={() => setIsEditTripOpen(false)} />}
    </header>
  );
};
