/**
 *
 * Created by Goodluck on 2017/5/2.
 * 一个复数类
 */
function Plural(real, img) {
    this.real = real;
    this.imagin = img;
}
/**
 * 加
 * @param a
 * @returns {Plural}
 */
Plural.prototype.add = function (a) {
    return new Plural(this.real + a.real, this.imagin + a.imagin)
};

/**
 * 减
 * @param a
 * @returns {Plural}
 */
Plural.prototype.subTract = function (a) {
    return new Plural(this.real - a.real, this.imagin - a.imagin)
};

/**
 * 乘
 * @param a
 * @returns {Plural}
 */
Plural.prototype.mul = function (a) {
    return new Plural(this.real * a.real - this.imagin * a.imagin, this.imagin * a.real + a.imagin * this.real)
};

/**
 * 除
 * @param a
 * @returns {Plural}
 */
Plural.prototype.divi = function (a) {
    var b = new Plural(a.real, -a.imagin);
    var fenzi = this.mul(b);
    var fenmu = a.real * a.real + a.imagin * a.imagin;
    return new Plural(fenzi.real / fenmu, fenzi.imagin / fenmu);
};

/**
 * 计算模值
 * @return {number}
 */
Plural.prototype.Mo = function () {
    return Math.sqrt(this.real * this.real + this.imagin * this.imagin);
};