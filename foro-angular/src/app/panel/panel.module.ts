// Modulos
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { PanelRoutingModule } from "./panel-routing.module";
import { MomentModule } from 'angular2-moment';

// Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';

// Servicios
import { UserService } from "../services/user.service";
import { UserGuard } from "../services/user.guard";

// NgModule
@NgModule({
  declarations: [//Todo lo que verá el usuario (Components, Pays)
    MainComponent,
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [//Cargar todos los Módulos
    CommonModule,
    FormsModule,
    HttpClientModule,
    PanelRoutingModule,
    MomentModule
  ],
  exports: [//Exportaremos todos estos componentes...
    MainComponent,
    ListComponent,
    AddComponent,
    EditComponent
  ],
  providers: [
    UserService,
    UserGuard
  ]
})
export class PanelModule {

}
