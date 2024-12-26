import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

async function ProtectedPage() {
  const user = await currentUser();
  const { userId } = auth();

  return (
    <div className="">
      User:{user?.firstName} userId: {userId}
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default ProtectedPage;
