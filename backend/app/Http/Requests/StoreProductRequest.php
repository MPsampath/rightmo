<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'unique:products,name', 'max:255'],
            'price' => ['required', 'numeric', 'min:1'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5']
        ];
    }
}
