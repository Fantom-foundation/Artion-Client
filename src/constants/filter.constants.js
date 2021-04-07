import ImageIcon from '@material-ui/icons/Image';
import DnsIcon from '@material-ui/icons/Dns';
import PublicIcon from '@material-ui/icons/Public';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import CollectionsIcon from '@material-ui/icons/Collections';
import SportsTennisIcon from '@material-ui/icons/SportsTennis';
import BuildIcon from '@material-ui/icons/Build';

export const GroupFilters = ['All Items', 'Single Items', 'Bundles'];

export const Categories = [
  {
    id: 0,
    icon: ImageIcon,
    label: 'Art',
  },
  {
    id: 1,
    icon: CollectionsIcon,
    label: 'Collectibles',
  },
  {
    id: 2,
    icon: SportsTennisIcon,
    label: 'Sports',
  },
  {
    id: 3,
    icon: BuildIcon,
    label: 'Utility',
  },
  {
    id: 4,
    icon: CardGiftcardIcon,
    label: 'Trading Cards',
  },
  {
    id: 5,
    icon: PublicIcon,
    label: 'Virtual Worlds',
  },
  {
    id: 6,
    icon: DnsIcon,
    label: 'Domain Names',
  },
];

export const SortByOptions = [
  {
    id: 0,
    label: 'Recently Listed',
  },
  {
    id: 1,
    label: 'Recently Created',
  },
  {
    id: 2,
    label: 'Recently Sold',
  },
  {
    id: 3,
    label: 'Ending Soon',
  },
  {
    id: 4,
    label: 'Cheapest',
  },
  {
    id: 5,
    label: 'Highest Last Sale',
  },
  {
    id: 6,
    label: 'Most Viewed',
  },
  {
    id: 7,
    label: 'Oldest',
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
