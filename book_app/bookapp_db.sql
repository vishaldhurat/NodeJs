-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2017 at 06:29 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `heroku_862e36cb50be6ef`
--

-- --------------------------------------------------------

--
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_name` varchar(45) DEFAULT NULL,
  `book_author` varchar(45) DEFAULT NULL,
  `book_isbn_no` varchar(45) DEFAULT NULL,
  `book_stream` varchar(45) DEFAULT NULL,
  `book_semester` int(11) NOT NULL,
  `book_edition` varchar(45) DEFAULT NULL,
  `book_publisher` varchar(45) DEFAULT NULL,
  `book_image_path` varchar(90) DEFAULT NULL,
  `book_price` int(11) DEFAULT NULL,
  `book_status` enum('onSale','Sold') NOT NULL DEFAULT 'onSale'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`book_id`, `user_id`, `book_name`, `book_author`, `book_isbn_no`, `book_stream`, `book_semester`, `book_edition`, `book_publisher`, `book_image_path`, `book_price`, `book_status`) VALUES
(2, 11, 'Angular Js', 'Sharad', 'ISBN123456', 'Computer Science', 1, '1', 'SAPANA', NULL, 500, 'Sold'),
(3, 13, 'Java', 'Sharad', 'ISBN123457', 'Computer Science', 1, '1', 'SAPANA', NULL, 500, 'Sold'),
(4, 13, 'Theory of Machines', 'R.S. Khurmi', 'ISBN123458', 'Mechanical', 1, '1', 'SAPANA', NULL, 500, 'onSale'),
(5, 13, 'Machine Design', 'J.K. Gupta', 'ISBN123459', 'Mechanical', 1, '1', 'SAPANA', NULL, 500, 'onSale'),
(6, 11, 'Gas Turbine Theory', 'Henry Cohen', 'ISBN123460', 'Mechanical', 1, '1', 'SAPANA', NULL, 500, 'onSale'),
(7, 13, 'Basic Electronics Engineering', 'A P Godse', 'ISBN123456', 'Electronics', 1, '1', 'SAPANA', NULL, 500, 'Sold'),
(8, 13, 'Basic Electronics Engineering', 'U.A.Baksh', 'ISBN123WERd', 'Electronics', 1, '1', 'SAPANA', NULL, 500, 'onSale'),
(9, 13, 'Testing UI', 'Testing UI', 'ISBN1234', 'Computer Science', 0, '1', 'Publuc', NULL, 560, 'onSale'),
(10, 0, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'onSale');

-- --------------------------------------------------------

--
-- Table structure for table `institution_info`
--

CREATE TABLE `institution_info` (
  `institution_info_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `university` varchar(45) DEFAULT NULL,
  `semester` int(11) NOT NULL,
  `state` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='information about institution form where the user belongs ';

--
-- Dumping data for table `institution_info`
--

INSERT INTO `institution_info` (`institution_info_id`, `user_id`, `name`, `university`, `semester`, `state`, `country`) VALUES
(1, 13, 'safdsfd', 'AAAAAAAAAAA', 2, 'Karantaka1', 'India1');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_email` varchar(255) DEFAULT NULL,
  `login_mobile` varchar(11) NOT NULL,
  `login_passkey` text NOT NULL,
  `login_salt` varchar(10) NOT NULL,
  `last_login` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `login_email_sent_date` datetime DEFAULT NULL,
  `login_password_changed_date` datetime DEFAULT NULL,
  `login_password_reset_date` datetime DEFAULT NULL,
  `created_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by_id` int(11) DEFAULT NULL,
  `updated_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_id`, `user_id`, `login_email`, `login_mobile`, `login_passkey`, `login_salt`, `last_login`, `login_email_sent_date`, `login_password_changed_date`, `login_password_reset_date`, `created_timestamp`, `updated_by_id`, `updated_timestamp`) VALUES
(1, 11, 'sharad.is.biradar@gmail.com', '9986477769', '02d73fa0760bf078a2fb76dc5c53562a115dc4feeb88f32d1387948f2cad2dba12e6f3cd3e2dab2cd081257da0151d7a5a374c38d26c16212fb67d8788833b06', 'f8bc7f575f', '2017-02-19 00:08:35', NULL, NULL, NULL, '2017-02-19 00:08:35', NULL, '2017-02-19 00:08:35'),
(2, 12, 'hanmanthpatil@gmail.com', '9972911911', 'e96daf1a525276e36af3f8b9c40256b2e08478a286433316e1b5b44a5b4da2238f95a297ef1e13c275b4d554a4f6b947535ba932deebd76435bb0dc86d4359ae', 'ad9e925af9', '2017-02-20 16:20:42', NULL, NULL, NULL, '2017-02-20 16:20:42', NULL, '2017-02-20 16:20:42'),
(3, 13, 'sandeepdj11@gmail.com', '7899551677', 'b376ad343b45fa599ffa723a93b9af8028609c08b9a7bd8e9966e88237153211d23693a1792b998b77f112b60da6dfccac08212f07a2759d6e9cacde5daa9f7c', 'd73a143e1b', '2017-03-12 20:10:32', NULL, NULL, NULL, '2017-03-12 20:10:32', NULL, '2017-03-12 20:10:32'),
(4, 15, 'jyotijalkote@gmail.com', '7899551676', 'b376ad343b45fa599ffa723a93b9af8028609c08b9a7bd8e9966e88237153211d23693a1792b998b77f112b60da6dfccac08212f07a2759d6e9cacde5daa9f7c', 'a6bbbb1c2d', '2017-04-04 22:06:10', NULL, NULL, NULL, '2017-04-04 22:06:10', NULL, '2017-04-04 22:06:10'),
(5, 16, 'sandeepraodj@gmail.com', '7411528283', '9a2043c17e9feb26a2f69989042836a281b6e70955e2dc5b052a3db0d41d84fcf31223c2f862f15e4f0173a21675e8b36c8713f0056fb5b385412774ee9bc673', 'b33c013161', '2017-04-08 15:29:28', NULL, NULL, NULL, '2017-04-08 15:29:28', NULL, '2017-04-08 15:29:28');

-- --------------------------------------------------------

--
-- Table structure for table `rack`
--

CREATE TABLE `rack` (
  `rack_id` int(11) NOT NULL,
  `rack_name` varchar(100) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `book_status` enum('available','pending','delivered') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stream_lookup`
--

CREATE TABLE `stream_lookup` (
  `stream_lookup_id` int(11) NOT NULL,
  `stream_lookup_name` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `saler_user_id` int(11) NOT NULL,
  `buyer_user_id` int(11) NOT NULL,
  `status` enum('available','pending','delivered') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `book_id`, `saler_user_id`, `buyer_user_id`, `status`) VALUES
(1, 3, 13, 11, 'delivered'),
(2, 7, 13, 11, 'delivered'),
(3, 6, 11, 13, 'delivered'),
(6, 2, 11, 13, 'delivered'),
(7, 7, 13, 13, 'delivered'),
(8, 3, 13, 13, 'delivered');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(45) NOT NULL DEFAULT '',
  `middle_name` varchar(45) DEFAULT '',
  `last_name` varchar(45) NOT NULL DEFAULT '',
  `institute_id` int(11) DEFAULT NULL,
  `user_status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `middle_name`, `last_name`, `institute_id`, `user_status`) VALUES
(11, 'Sharad', 'Nivrutti', 'Biradar', NULL, 'ACTIVE'),
(12, 'Hanmant', 'Bapurao', 'Patil', NULL, 'ACTIVE'),
(13, 'Sandeep', 'Dattatray', 'Jadhav', NULL, 'ACTIVE'),
(15, 'Jyoti', 'Sandeep', 'Jadhav', NULL, 'ACTIVE'),
(16, 'Sandeep', 'Dattatray', 'Jadhav', NULL, 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `house_no` varchar(45) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `landmark` varchar(45) DEFAULT NULL,
  `Area` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `pincode` int(11) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`book_id`),
  ADD UNIQUE KEY `book_id_UNIQUE` (`book_id`);

--
-- Indexes for table `institution_info`
--
ALTER TABLE `institution_info`
  ADD PRIMARY KEY (`institution_info_id`),
  ADD UNIQUE KEY `institution_info_id_UNIQUE` (`institution_info_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`login_id`),
  ADD UNIQUE KEY `user_login_mobile_UNIQUE` (`login_mobile`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `rack`
--
ALTER TABLE `rack`
  ADD PRIMARY KEY (`rack_id`),
  ADD UNIQUE KEY `rack_id_UNIQUE` (`rack_id`);

--
-- Indexes for table `stream_lookup`
--
ALTER TABLE `stream_lookup`
  ADD PRIMARY KEY (`stream_lookup_id`),
  ADD UNIQUE KEY `stream_lookup_id_UNIQUE` (`stream_lookup_id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`),
  ADD UNIQUE KEY `transition_id_UNIQUE` (`transaction_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id_UNIQUE` (`user_id`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`address_id`),
  ADD UNIQUE KEY `address_id_UNIQUE` (`address_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `institution_info`
--
ALTER TABLE `institution_info`
  MODIFY `institution_info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `rack`
--
ALTER TABLE `rack`
  MODIFY `rack_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
