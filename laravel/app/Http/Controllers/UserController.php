<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use Illuminate\Http\Request;
use Nette\Schema\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index()
    {
        return auth()->user()->makeVisible(['role']);
    }


    public function store(Request $request)
    {

		$validator = Validator::make($request->all(), [
			'name' => 'required|string|max:128',
			'phone' => 'required|unique:users|min:11|max:11',
			'password' => 'required|string|min:5',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors();
	
			return response()->json(['errors' => $errors], 422);
		}
		
        $user = new User();
		$user->name = $request->name;
		$user->phone = $request->phone;
		$user->password = bcrypt($request->password);
		$user->save();

		$token = $user->createToken('apiToken')->plainTextToken;

		$res = [
			'user' => $user,
			'token' => $token
		];

		return response($res, 201);
    }

	protected $appAdminCode;

	public function __construct()
    {
        $this->appAdminCode = env('APP_ADMIN_CODE', false);
    }

    public function admin(Request $request)
    {

		$validator = Validator::make($request->all(), [
			'name' => 'required|string|max:128',
			'phone' => 'required|unique:users|min:11|max:11',
			'password' => 'required|string|min:5',
			'code' => 'required|string|max:128',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors();
			return response()->json(['errors' => $errors], 422);
		}

		if($request->code !== $this->appAdminCode){
			return response([
				'msg' => 'Неверный код',
			], 401);
		}

        $user = new User();
		$user->name = $request->name;
		$user->phone = $request->phone;
		$user->password = bcrypt($request->password);
		$user->role = 'admin';
		$user->save();

		$token = $user->createToken('apiToken')->plainTextToken;

		$res = [
			'user' => $user,
			'token' => $token
		];

		return response($res, 201);
    }

	public function login(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'phone' => 'required',
			'password' => 'required',
		]);

		if ($validator->fails()) {
			$errors = $validator->errors();
	
			return response()->json(['errors' => $errors], 422);
		}
	
		$user = User::where('phone', $request['phone'])->first();
	
		if (!$user || !Hash::check($request['password'], $user->password)) {
			return response([
				'msg' => 'Неверный номер телефона или пароль'
			], 401);
		}
	
		$token = $user->createToken('apiToken')->plainTextToken;
	
		$res = [
			'user' => $user,
			'token' => $token
		];
	
		return response($res, 200);
	}

	public function logout(Request $request)
	{
		auth()->user()->tokens()->delete();
		return [
			'message' => 'Вы успешно вышли из аккаунта'
		];
	}

    public function show(string $id)
    {
        //
    }


    public function update(Request $request, string $id)
    {
        //
    }


    public function destroy(string $id)
    {
        //
    }
}
