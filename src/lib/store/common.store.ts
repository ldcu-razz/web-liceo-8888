import { ticketsActions } from "./tickets.store";
import { notificationsActions } from "./notifications.store";
import { filesActions } from "./files.store";
import { dashboardActions } from "./dashboard.store";
import { ticketCommentsActions } from "./ticket-comments.store";
import { ticketUpdatesActions } from "./ticket-updates.store";
import { userPropertiesActions } from "./user-properties.store";


export const commonActions = {
	clearUpStores: () => {
		ticketsActions.reset();
    ticketCommentsActions.reset();
    ticketUpdatesActions.reset();
		notificationsActions.reset();
		filesActions.reset();
    dashboardActions.reset();
    userPropertiesActions.reset();
	}
}