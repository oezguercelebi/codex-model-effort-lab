import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Destination,
  Friend,
  TripExpense,
  ChecklistItem,
  CarpoolGroup,
  TripMeta,
  ToastMessage,
  ItineraryActivity,
} from '../types';
import {
  INITIAL_FRIENDS,
  INITIAL_DESTINATIONS,
  INITIAL_VOTES,
  INITIAL_COMMENTS,
  INITIAL_EXPENSES,
  INITIAL_CHECKLIST,
  INITIAL_CARPOOLS,
  INITIAL_TRIP_META,
} from '../data/initialData';

export type NavigationTab = 'destinations' | 'compare' | 'voting' | 'itinerary' | 'budget' | 'essentials';

export interface DestinationScore {
  destinationId: string;
  totalPoints: number;
  firstPlaceVotes: number;
  secondPlaceVotes: number;
  thirdPlaceVotes: number;
  totalVoters: number;
  voterIds: string[];
  groupMatchPercentage: number; // 0 - 100%
}

interface TripContextType {
  // Data
  friends: Friend[];
  currentFriendId: string;
  currentFriend: Friend;
  destinations: Destination[];
  votes: Record<string, { rank1: string; rank2?: string; rank3?: string; timestamp: string }>;
  comments: typeof INITIAL_COMMENTS;
  expenses: TripExpense[];
  checklist: ChecklistItem[];
  carpools: CarpoolGroup[];
  tripMeta: TripMeta;
  activeTab: NavigationTab;
  comparedDestinationIds: string[];
  toasts: ToastMessage[];
  selectedDestinationForItinerary: string; // fallback or view other destination itinerary

  // Computed
  scores: Record<string, DestinationScore>;
  leaderDestination: Destination;
  winningDestination: Destination;
  currency: string;

  // Actions
  setCurrentFriendId: (id: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedDestinationForItinerary: (id: string) => void;
  castVote: (rank1: string, rank2?: string, rank3?: string) => void;
  addComment: (destinationId: string, text: string, reaction?: string) => void;
  addDestination: (dest: Destination) => void;
  toggleCompare: (destinationId: string) => void;
  clearCompare: () => void;
  setComparedDestinationIds: (ids: string[]) => void;
  toggleVotingLock: () => void;
  setWinningDestinationId: (id: string) => void;
  addItineraryActivity: (destinationId: string, activity: Omit<ItineraryActivity, 'id'>) => void;
  toggleItineraryActivity: (destinationId: string, activityId: string) => void;
  deleteItineraryActivity: (destinationId: string, activityId: string) => void;
  toggleChecklist: (id: string) => void;
  assignChecklist: (id: string, friendId?: string) => void;
  addChecklistItem: (title: string, category: ChecklistItem['category'], assignedToFriendId?: string) => void;
  deleteChecklistItem: (id: string) => void;
  addExpense: (expense: Omit<TripExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  updateTripMeta: (meta: Partial<TripMeta>) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  calculateDestinationCostPerPerson: (destination: Destination, nights?: number, headcount?: number) => {
    lodgingShare: number;
    travelShare: number;
    foodShare: number;
    activitiesShare: number;
    totalPerPerson: number;
    totalForGroup: number;
  };
  resetAllData: () => void;
}

const STORAGE_KEY = 'weekender_app_v1_state';

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or fallback to defaults
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [friends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [currentFriendId, setCurrentFriendIdState] = useState<string>(() =>
    loadStored('currentFriendId', 'friend-1')
  );
  const [destinations, setDestinations] = useState<Destination[]>(() =>
    loadStored('destinations', INITIAL_DESTINATIONS)
  );
  const [votes, setVotes] = useState<Record<string, { rank1: string; rank2?: string; rank3?: string; timestamp: string }>>(() =>
    loadStored('votes', INITIAL_VOTES)
  );
  const [comments, setComments] = useState(() => loadStored('comments', INITIAL_COMMENTS));
  const [expenses, setExpenses] = useState<TripExpense[]>(() =>
    loadStored('expenses', INITIAL_EXPENSES)
  );
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    loadStored('checklist', INITIAL_CHECKLIST)
  );
  const [carpools, setCarpools] = useState<CarpoolGroup[]>(() =>
    loadStored('carpools', INITIAL_CARPOOLS)
  );
  const [tripMeta, setTripMeta] = useState<TripMeta>(() =>
    loadStored('tripMeta', INITIAL_TRIP_META)
  );
  const [activeTab, setActiveTab] = useState<NavigationTab>('destinations');
  const [comparedDestinationIds, setComparedDestinationIds] = useState<string[]>([]);
  const [selectedDestinationForItinerary, setSelectedDestinationForItinerary] = useState<string>(
    tripMeta.winningDestinationId || 'dest-1'
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_currentFriendId`, JSON.stringify(currentFriendId));
      localStorage.setItem(`${STORAGE_KEY}_destinations`, JSON.stringify(destinations));
      localStorage.setItem(`${STORAGE_KEY}_votes`, JSON.stringify(votes));
      localStorage.setItem(`${STORAGE_KEY}_comments`, JSON.stringify(comments));
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}_checklist`, JSON.stringify(checklist));
      localStorage.setItem(`${STORAGE_KEY}_carpools`, JSON.stringify(carpools));
      localStorage.setItem(`${STORAGE_KEY}_tripMeta`, JSON.stringify(tripMeta));
    } catch {
      // ignore storage quota errors
    }
  }, [currentFriendId, destinations, votes, comments, expenses, checklist, carpools, tripMeta]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentFriend = useMemo(() => {
    return friends.find((f) => f.id === currentFriendId) || friends[0];
  }, [friends, currentFriendId]);

  const setCurrentFriendId = (id: string) => {
    setCurrentFriendIdState(id);
    const target = friends.find((f) => f.id === id);
    if (target) {
      showToast(`Switched active profile to ${target.name}`, 'info');
    }
  };

  // Calculate per person cost breakdown
  const calculateDestinationCostPerPerson = (
    destination: Destination,
    nights: number = 2,
    headcount: number = 6
  ) => {
    const safeCount = Math.max(1, headcount);
    const lodgingShare = Math.round((destination.costBreakdown.lodgingPerNight * nights) / safeCount);
    const travelShare = destination.costBreakdown.estimatedTravel;
    const foodShare = destination.costBreakdown.foodAndDrinksPerDay * nights;
    const activitiesShare = destination.costBreakdown.activitiesTotal;
    const totalPerPerson = lodgingShare + travelShare + foodShare + activitiesShare;
    const totalForGroup = totalPerPerson * safeCount;

    return {
      lodgingShare,
      travelShare,
      foodShare,
      activitiesShare,
      totalPerPerson,
      totalForGroup,
    };
  };

  // Group Compatibility Match Algorithm
  const calculateGroupMatch = (dest: Destination): number => {
    let totalScore = 0;
    const count = friends.length;

    friends.forEach((friend) => {
      let friendScore = 100;
      // Drive time penalty
      if (dest.driveTimeHours > friend.preference.maxDriveHours) {
        const diff = dest.driveTimeHours - friend.preference.maxDriveHours;
        friendScore -= Math.min(40, diff * 18);
      }

      // Budget check
      const estCost = calculateDestinationCostPerPerson(dest).totalPerPerson;
      if (estCost > friend.preference.maxBudget) {
        const over = estCost - friend.preference.maxBudget;
        friendScore -= Math.min(35, (over / friend.preference.maxBudget) * 60);
      }

      // Vibe match bonus
      const matchesVibe = dest.vibe.some((v) => friend.preference.preferredVibe.includes(v));
      if (!matchesVibe) {
        friendScore -= 20;
      }

      totalScore += Math.max(25, friendScore);
    });

    return Math.round(totalScore / count);
  };

  // Compute Scores
  const scores = useMemo(() => {
    const result: Record<string, DestinationScore> = {};

    destinations.forEach((d) => {
      result[d.id] = {
        destinationId: d.id,
        totalPoints: 0,
        firstPlaceVotes: 0,
        secondPlaceVotes: 0,
        thirdPlaceVotes: 0,
        totalVoters: 0,
        voterIds: [],
        groupMatchPercentage: calculateGroupMatch(d),
      };
    });

    Object.entries(votes).forEach(([friendId, vote]) => {
      if (vote.rank1 && result[vote.rank1]) {
        result[vote.rank1].totalPoints += 3;
        result[vote.rank1].firstPlaceVotes += 1;
        result[vote.rank1].totalVoters += 1;
        if (!result[vote.rank1].voterIds.includes(friendId)) {
          result[vote.rank1].voterIds.push(friendId);
        }
      }
      if (vote.rank2 && result[vote.rank2]) {
        result[vote.rank2].totalPoints += 2;
        result[vote.rank2].secondPlaceVotes += 1;
        if (!result[vote.rank2].voterIds.includes(friendId)) {
          result[vote.rank2].voterIds.push(friendId);
        }
      }
      if (vote.rank3 && result[vote.rank3]) {
        result[vote.rank3].totalPoints += 1;
        result[vote.rank3].thirdPlaceVotes += 1;
        if (!result[vote.rank3].voterIds.includes(friendId)) {
          result[vote.rank3].voterIds.push(friendId);
        }
      }
    });

    return result;
  }, [destinations, votes, friends]);

  // Leader Destination based on highest point score
  const leaderDestination = useMemo(() => {
    let topDest = destinations[0];
    let topScore = -1;

    destinations.forEach((d) => {
      const score = scores[d.id]?.totalPoints ?? 0;
      if (score > topScore) {
        topScore = score;
        topDest = d;
      }
    });

    return topDest || destinations[0];
  }, [destinations, scores]);

  // Winning destination is either explicitly locked in or the current leader
  const winningDestination = useMemo(() => {
    if (tripMeta.winningDestinationId) {
      const matched = destinations.find((d) => d.id === tripMeta.winningDestinationId);
      if (matched) return matched;
    }
    return leaderDestination;
  }, [tripMeta.winningDestinationId, destinations, leaderDestination]);

  // Cast vote for current friend
  const castVote = (rank1: string, rank2?: string, rank3?: string) => {
    setVotes((prev) => ({
      ...prev,
      [currentFriendId]: {
        rank1,
        rank2,
        rank3,
        timestamp: new Date().toISOString(),
      },
    }));

    const dest = destinations.find((d) => d.id === rank1);
    showToast(
      `Ranked ballot submitted for ${currentFriend.name}! #1: ${dest?.name ?? 'Top Pick'}`,
      'success'
    );
  };

  // Add Comment
  const addComment = (destinationId: string, text: string, reaction: string = '💬') => {
    if (!text.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      friendId: currentFriendId,
      destinationId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      reaction,
    };
    setComments((prev) => [newComment, ...prev]);
    showToast(`Note posted by ${currentFriend.name}`, 'info');
  };

  // Add custom Destination
  const addDestination = (dest: Destination) => {
    setDestinations((prev) => [dest, ...prev]);
    showToast(`Proposed new getaway: "${dest.name}"!`, 'success');
  };

  // Compare toggles
  const toggleCompare = (destinationId: string) => {
    setComparedDestinationIds((prev) => {
      if (prev.includes(destinationId)) {
        return prev.filter((id) => id !== destinationId);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 destinations at a time.', 'warning');
        return prev;
      }
      return [...prev, destinationId];
    });
  };

  const clearCompare = () => {
    setComparedDestinationIds([]);
  };

  const toggleVotingLock = () => {
    setTripMeta((prev) => {
      const newLocked = !prev.isVotingLocked;
      const newWinning = newLocked ? leaderDestination.id : prev.winningDestinationId;
      showToast(
        newLocked
          ? `Voting closed! 🎉 ${leaderDestination.name} declared the winning trip destination!`
          : 'Voting reopened for the group.',
        'info'
      );
      return {
        ...prev,
        isVotingLocked: newLocked,
        winningDestinationId: newWinning,
      };
    });
  };

  const setWinningDestinationId = (id: string) => {
    setTripMeta((prev) => ({
      ...prev,
      winningDestinationId: id,
    }));
    const target = destinations.find((d) => d.id === id);
    showToast(`Selected "${target?.name}" as the group itinerary destination!`, 'success');
  };

  // Itinerary Actions
  const addItineraryActivity = (destinationId: string, activity: Omit<ItineraryActivity, 'id'>) => {
    const newAct: ItineraryActivity = {
      ...activity,
      id: `act-custom-${Date.now()}`,
      isCompleted: false,
    };

    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === destinationId) {
          return {
            ...d,
            sampleItinerary: [...d.sampleItinerary, newAct],
          };
        }
        return d;
      })
    );
    showToast(`Added "${newAct.title}" to ${newAct.day} itinerary`, 'success');
  };

  const toggleItineraryActivity = (destinationId: string, activityId: string) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === destinationId) {
          return {
            ...d,
            sampleItinerary: d.sampleItinerary.map((act) =>
              act.id === activityId ? { ...act, isCompleted: !act.isCompleted } : act
            ),
          };
        }
        return d;
      })
    );
  };

  const deleteItineraryActivity = (destinationId: string, activityId: string) => {
    setDestinations((prev) =>
      prev.map((d) => {
        if (d.id === destinationId) {
          return {
            ...d,
            sampleItinerary: d.sampleItinerary.filter((act) => act.id !== activityId),
          };
        }
        return d;
      })
    );
    showToast('Activity removed from itinerary', 'info');
  };

  // Checklist Actions
  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const assignChecklist = (id: string, friendId?: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, assignedToFriendId: friendId } : item))
    );
    const assignedFriend = friends.find((f) => f.id === friendId);
    showToast(
      assignedFriend ? `Assigned to ${assignedFriend.name}` : 'Item unassigned',
      'info'
    );
  };

  const addChecklistItem = (
    title: string,
    category: ChecklistItem['category'],
    assignedToFriendId?: string
  ) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      title,
      category,
      assignedToFriendId,
      isCompleted: false,
    };
    setChecklist((prev) => [...prev, newItem]);
    showToast(`Added "${title}" to packing checklist`, 'success');
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
    showToast('Checklist item removed', 'info');
  };

  // Expense Actions
  const addExpense = (expense: Omit<TripExpense, 'id'>) => {
    const newExpense: TripExpense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Added expense "$${expense.amount} - ${expense.title}"`, 'success');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Expense removed', 'info');
  };

  const updateTripMeta = (meta: Partial<TripMeta>) => {
    setTripMeta((prev) => ({ ...prev, ...meta }));
    showToast('Trip settings updated', 'success');
  };

  // Reset to original mock data
  const resetAllData = () => {
    localStorage.clear();
    setCurrentFriendIdState('friend-1');
    setDestinations(INITIAL_DESTINATIONS);
    setVotes(INITIAL_VOTES);
    setComments(INITIAL_COMMENTS);
    setExpenses(INITIAL_EXPENSES);
    setChecklist(INITIAL_CHECKLIST);
    setCarpools(INITIAL_CARPOOLS);
    setTripMeta(INITIAL_TRIP_META);
    setComparedDestinationIds([]);
    setSelectedDestinationForItinerary('dest-1');
    showToast('Reset all trip data to realistic starter demo!', 'info');
  };

  return (
    <TripContext.Provider
      value={{
        friends,
        currentFriendId,
        currentFriend,
        destinations,
        votes,
        comments,
        expenses,
        checklist,
        carpools,
        tripMeta,
        activeTab,
        comparedDestinationIds,
        toasts,
        selectedDestinationForItinerary,
        scores,
        leaderDestination,
        winningDestination,
        currency: '$',
        setCurrentFriendId,
        setActiveTab,
        setSelectedDestinationForItinerary,
        castVote,
        addComment,
        addDestination,
        toggleCompare,
        clearCompare,
        setComparedDestinationIds,
        toggleVotingLock,
        setWinningDestinationId,
        addItineraryActivity,
        toggleItineraryActivity,
        deleteItineraryActivity,
        toggleChecklist,
        assignChecklist,
        addChecklistItem,
        deleteChecklistItem,
        addExpense,
        deleteExpense,
        updateTripMeta,
        showToast,
        removeToast,
        calculateDestinationCostPerPerson,
        resetAllData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
