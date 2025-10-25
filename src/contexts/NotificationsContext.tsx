// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   Dispatch,
//   SetStateAction,
// } from "react";


// type NotificationsContextType = {
//   notificationsCount: number;
//   setNotificationsCount: Dispatch<SetStateAction<number>>; // <--- изменили тип
// };

// const NotificationsContext = createContext<
//   NotificationsContextType | undefined
// >(undefined);

// export const NotificationsProvider = ({
//   children,
// }: {
//   children: ReactNode;
// }) => {
//   const [notificationsCount, setNotificationsCount] = useState<number>(10);

//   return (
//     <NotificationsContext.Provider
//       value={{ notificationsCount, setNotificationsCount }}
//     >
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const ctx = useContext(NotificationsContext);
//   if (!ctx)
//     throw new Error(
//       "useNotifications must be used within NotificationsProvider"
//     );
//   return ctx;
// };
