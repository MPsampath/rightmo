<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('id');
        return [
            'name' => ['sometimes', 'string', 'unique:products,name,' . $productId, 'max:255'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'rating' => ['sometimes', 'numeric', 'min:0', 'max:5']
        ];
    }
}
