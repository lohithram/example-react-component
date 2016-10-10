import { ApplicationDispatcher, DeliverAndCollectActionTypes as ComponentActionTypes } from '../class-library';
export default class DeliverToAddressStatusActions{

  static changeStatus(status){
    ApplicationDispatcher.dispatch({
      actionType: ComponentActionTypes.UPDATE_STATUS,
      action: { status }
    });
  }

}
