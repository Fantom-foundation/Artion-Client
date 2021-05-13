import iconArt from 'assets/svgs/art.svg';
import iconCollectibles from 'assets/svgs/collectibles.svg';
import iconSports from 'assets/svgs/sports.svg';
import iconUtility from 'assets/svgs/utility.svg';
import iconTrading from 'assets/svgs/trading.svg';
import iconVirtual from 'assets/svgs/virtual.svg';
import iconDomain from 'assets/svgs/domain.svg';

export const GroupFilters = ['All Items', 'Single Items', 'Bundles'];

export const Categories = [
  {
    id: 0,
    icon: iconArt,
    label: 'Art',
  },
  {
    id: 1,
    icon: iconCollectibles,
    label: 'Collectibles',
  },
  {
    id: 2,
    icon: iconSports,
    label: 'Sports',
  },
  {
    id: 3,
    icon: iconUtility,
    label: 'Utility',
  },
  {
    id: 4,
    icon: iconTrading,
    label: 'Trading Cards',
  },
  {
    id: 5,
    icon: iconVirtual,
    label: 'Virtual Worlds',
  },
  {
    id: 6,
    icon: iconDomain,
    label: 'Domain Names',
  },
];

export const SortByOptions = [
  {
    id: 'listedAt',
    label: 'Recently Listed',
  },
  {
    id: 'soldAt',
    label: 'Recently Sold',
  },
  {
    id: 'saleEndsAt',
    label: 'Ending Soon',
  },
  {
    id: 'price',
    label: 'Cheapest',
  },
  {
    id: 'lastSalePrice',
    label: 'Highest Last Sale',
  },
  {
    id: 'viewed',
    label: 'Most Viewed',
  },
];

const FilterConstants = {
  UPDATE_STATUS_FILTER: 'UPDATE_STATUS_FILTER',
  UPDATE_COLLECTIONS_FILTER: 'UPDATE_COLLECTIONS_FILTER',
  UPDATE_CATEGORIES_FILTER: 'UPDATE_CATEGORIES_FILTER',
  UPDATE_GROUP_TYPE_FILTER: 'UPDATE_GROUP_TYPE_FILTER',
  UPDATE_SORT_BY_FILTER: 'UPDATE_SORT_BY_FILTER',
};

export default FilterConstants;
