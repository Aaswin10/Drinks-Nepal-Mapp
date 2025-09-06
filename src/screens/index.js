import AboutUs from './AboutUs';
import AccountCreated from './AccountCreated';
import AddANewAddress from './AddANewAddress';
import AddANewCard from './AddANewCard';
import CategoryShop from './CategoryShop';
import Checkout from './Checkout';
import CheckoutShippingDetails from './CheckoutShippingDetails';
import ConfirmationCode from './ConfirmationCode';
import DOrderDetails from './DeliveryScreens/DOrderDetails';
import DOrders from './DeliveryScreens/DOrders';
import EditProfile from './EditProfile';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordSentEmail from './ForgotPasswordSentEmail';
import LeaveAReviews from './LeaveAReviews';
import MyAddress from './MyAddress';
import MyPromocodes from './MyPromocodes';
import NewPassword from './NewPassword';
import Notification from './Notification';
import Onboarding from './Onboarding';
import Order from './Order';
import OrderDetails from './OrderDetails';
import OrderFailed from './OrderFailed';
import OrderHistory from './OrderHistory';
import OrderSuccessful from './OrderSuccessful';
import PaymentMethod from './PaymentMethod';
import PrivacyPolicy from './PrivacyPolicy';
import Product from './Product';
import Profile from './Profile';
import Reviews from './Reviews';
import Search from './Search';
import Shop from './Shop';
import SignIn from './SignIn';
import SignUp from './SignUp';
import TermsOfService from './TermsOfService';
import TrackYourOrder from './TrackYourOrder';
import VerifyYourPhoneNumber from './VerifyYourPhoneNumber';
import Wishlist from './Wishlist';

const screens = {
  // Core App Screens
  Onboarding,
  VerifyYourPhoneNumber,
  ConfirmationCode,
  SignUp,
  AccountCreated,
  
  // Main App Screens
  HomeOne: Search, // Using Search as the main home with all features
  Search,
  Product,
  CategoryShop,
  Order,
  Profile,
  
  // Order Management
  OrderHistory,
  OrderDetails,
  OrderSuccessful,
  OrderFailed,
  TrackYourOrder,
  
  // Checkout Flow
  Checkout,
  CheckoutShippingDetails,
  PaymentMethod,
  
  // Profile & Settings
  EditProfile,
  MyAddress,
  AddANewAddress,
  MyPromocodes,
  AboutUs,
  PrivacyPolicy,
  TermsOfService,
  
  // Reviews & Feedback
  Reviews,
  LeaveAReviews,
  
  // Delivery Screens
  DOrders,
  DOrderDetails,
  
  // Notifications
  Notification,
  
  // Wishlist (if needed)
  Wishlist,
};

export { screens };