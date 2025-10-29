import ProfileBanner from "./ui/ProfileBanner";
import UserProfileForm from "@/pages/profile/ui/UserProfileForm";
import "./UserProfilePage.css";

function UserProfilePage() {
  return (
    <div className="profile">
      <ProfileBanner />
      <UserProfileForm />
    </div>
  );
}

export default UserProfilePage;