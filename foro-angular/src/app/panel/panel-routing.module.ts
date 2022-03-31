import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserGuard } from "../services/user.guard";

// Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';

const panelRoutes: Routes = [
  {
    path:"panel",//Ruta principal
    component: MainComponent,//Este componente se utilizara en la ruta /panel
    canActivate:[UserGuard],//Puede pasar cuando el Guard retorna True.
    children:[
      {
        path:"",
        component:ListComponent
      },
      {
        path:"crear",
        component:AddComponent
      },
      {
        path:"listado",
        component:ListComponent
      },
      {
        path:"editar/:id",
        component:EditComponent
      },
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(panelRoutes)//Carga las rutas...
  ],
  exports: [
    RouterModule//Módulo exportable...
  ]
})

export class PanelRoutingModule {

}
