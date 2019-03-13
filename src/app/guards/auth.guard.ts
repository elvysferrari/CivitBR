import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Injectable()

export class AuthGuard implements CanActivate{
    public constructor (private router: Router, private auth: AuthService){

    }

    public canActivate(){
        return this.auth.authenticated       
    }
}