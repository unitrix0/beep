import {Component, OnInit, TemplateRef} from '@angular/core';
import {ShoppingListService} from '../_services/shopping-list.service';
import {ShoppingListEntry} from '../_models/shopping-list-entry';
import {AlertifyService} from '../_services/alertify.service';
import {PermissionsService} from '../_services/permissions.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ShoppingListGroupEntry} from '../_models/shopping-list-group-entry';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  largeImage: string;
  modalRef: BsModalRef;
  articleEntries: ShoppingListEntry[];
  groupEntries: ShoppingListGroupEntry[];

  constructor(private listService: ShoppingListService, private  alertify: AlertifyService, public permissions: PermissionsService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.getShoppingList(this.permissions.token.environment_id);
  }

  getShoppingList(environmentId: string) {
    this.listService.getShoppingList(environmentId)
      .subscribe(value => {
        this.articleEntries = value.articleEntries;
        this.groupEntries = value.groupEntries;
      }, error => {
        this.alertify.error('Die Liste konnte nicht abgefragt werden: ' + error);
      });
  }

  articleDone(barcode: string, done: boolean) {
    this.articleEntries.filter(s => s.articles.find(a => a.barcode === barcode))
      .map(s => s.articles.filter(a => a.barcode === barcode)
        .map(a => {
          a.done = done;
        }));
  }

  showProdPicture(imageUrl: string, dialog: TemplateRef<any>) {
    console.log('xxx');
    this.largeImage = imageUrl;
    this.modalRef = this.modalService.show(dialog);
  }
}
