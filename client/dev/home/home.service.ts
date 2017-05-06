import {
  Inject,
  Injectable
} from "@angular/core";


import { Http } from "@angular/http";

import "rxjs/add/operator/map";

@Injectable()
export class HomeService {

  constructor(@Inject(Http) private _http: Http) {

  }


}
